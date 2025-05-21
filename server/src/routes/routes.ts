import {Router, Request, Response, NextFunction} from "express";
import {PassportStatic} from "passport";
import {User} from "../models/User";
import {logE, logI} from "../Utils/Log";
import {FitnessGroup} from "../models/FitnessGroup";
import {Trainer} from "../models/Trainer";

export const configureRoutes = (passport: PassportStatic, router: Router):Router => {
    router.get("/", (req: Request, res: Response) => {
        res.status(200).send('Hello World')
    })


    router.post("/login", (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate("local", (error:string | null, user: typeof User) => {
            if (error) {
                logE(error);
                res.status(500).send(error);
            } else {
                if (!user) {
                    res.status(400).send("User not found");
                    return;
                }
                req.login(user, (err: string | null) => {
                    if (err) {
                        logE(err);
                        res.status(500).send("internal server error");
                    } else {
                        logI("User logged in: ", user);
                        res.status(200).send(user);
                    }
                })
            }
        })(req, res, next);
    });

    router.post("/register", (req: Request, res: Response) => {
        const email = req.body.email;
        const password = req.body.password;
        const user = new User({email: email, password: password});

        user.save().then((data) => {
            logI("User registered: ", data);
            res.status(200).send(data);
        }).catch((error) => {
            logE(error);
            res.status(500).send("internal server error");
        })
    });

    router.post("/logout", (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    logE(error);
                    res.status(500).send("internal server error");
                    return;
                }
                res.status(200).send("User logged out");
            })
            return;
        }
        res.status(401).send("User not logged in");
    });

    router.get("/user", (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const user = req.user;
            res.status(200).send(user);
            return;
        }
        res.status(401).send("User not logged in");
    });

    // TODO: this
    router.post("/updateUser", (req: Request, res: Response) => {
        if (req.isAuthenticated()) {

        }
    });

    router.get("/listusers", (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const user = req.user as any;
            if (user && user.role === "admin") {
                User.find().then((data) => {
                    logI("Users listed: ", data);
                    res.status(200).send(data);
                }).catch((error) => {
                    logE('', error);
                    res.status(500).send("internal server error");
                });
                return;
            }
            res.status(401).send("User not authorized");
            return;
        }
        res.status(401).send("User not logged in");
    });

    router.post("/getUser", (req: Request, res: Response) => {
        const id = req.body._id;
        User.findById({_id: id}).then((data) => {
            logI("User listed: ", data);
            res.status(200).send(data);
        }).catch((error) => {
            logE('', error);
            res.status(500).send("internal server error");
        });
    });

    router.post("/joinFitnessGroup", (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const user = req.user as any;
            if (user) {
                const id = req.body._id;
                const userId: string = user._id;
                FitnessGroup.findById(id).then(fitnessGroup => {
                    if (!fitnessGroup) {
                        return res.status(404).send('Fitness group not found.');
                    }

                    if (fitnessGroup.users && fitnessGroup.users.includes(userId)) {
                        return res.status(400).send('User is already in this fitness group.');
                    }

                    const updatedUsers: string[] = fitnessGroup.users ? [...fitnessGroup.users, userId] : [userId];

                    FitnessGroup.updateOne({ _id: id }, {
                        name: fitnessGroup.name,
                        trainer: fitnessGroup.trainer,
                        startTime: fitnessGroup.startTime,
                        endTime: fitnessGroup.endTime,
                        description: fitnessGroup.description,
                        users: updatedUsers
                    }).then(() => {
                        logI("User added to group: ", { id, userId });
                        res.status(200).send({ message: 'User added successfully' });
                    }).catch(error => {
                        logE('Error updating fitness group:', error);
                        res.status(500).send('Internal server error.');
                    });
                }).catch(error => {
                    logE('Error finding fitness group:', error);
                    res.status(500).send('Internal server error.');
                });
            } else {
                res.status(401).send("User not authorized");
            }
        } else {
            res.status(401).send("User not logged in");
        }
    });

    router.get("/listFitnessgroups", (req: Request, res: Response) => {
        FitnessGroup.find().then((data) => {
            logI("FitnessGroups listed: ", data);
            res.status(200).send(data);
        }).catch((error) => {
            logE('', error);
            res.status(500).send("internal server error");
        });
        return;
    });

    router.post("/addFitnessGroup", (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const user = req.user as any;
            if (user && user.role === "admin") {
                const name = req.body.name;
                const trainer_id = req.body.trainer;
                const startTime = req.body.startTime;
                const endTime = req.body.endTime;
                const description = req.body.description;

                const fitnessGroup = new FitnessGroup({name: name, trainer: trainer_id, startTime: startTime, endTime: endTime, description: description});

                fitnessGroup.save().then((data) => {
                    logI("Fitness group registered: ", data);
                    res.status(200).send(data);
                }).catch((error) => {
                    logE(error);
                    res.status(500).send("internal server error");
                })
            } else {
                res.status(401).send("User not authorized");
            }
        } else {
            res.status(401).send("User not logged in");
        }
    });

    router.post("/deleteFitnessGroup", (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const user = req.user as any;
            if (user && user.role === "admin") {
                const id = req.body._id;
                const query = FitnessGroup.findById(id);
                query.then(async fitnessGroup => {
                    if (!fitnessGroup) {
                        return res.status(404).send('Fitness group not found.');
                    }
                    FitnessGroup.deleteOne({ _id: id }).then(() => {
                        logI('Fitness group deleted: ', fitnessGroup);
                        res.status(200).json({message: 'Fitness group deleted successfully.'});
                    }).catch(error => {
                        logE('Internal server error:', error);
                        res.status(500).send('Internal server error.');
                    });
                }).catch(error => {
                    logE('Error deleting fitnessGroup:', error);
                    res.status(500).send('Internal server error.');
                });

            }
        }
    });

    router.get("/listTrainers", (req: Request, res: Response) => {
        Trainer.find().then((data) => {
            logI("Trainers listed: ", data);
            res.status(200).send(data);
        }).catch((error) => {
            logE('', error);
            res.status(500).send("internal server error");
        });
    });

    router.post("/getTrainer", (req: Request, res: Response) => {
        const id = req.body._id;
        Trainer.findById({_id: id}).then((data) => {
            logI("Trainers listed: ", data);
            res.status(200).send(data);
        }).catch((error) => {
            logE('', error);
            res.status(500).send("internal server error");
        });
    });

    router.post("/addTrainer", (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const user = req.user as any;
            if (user && user.role === "admin") {
                const name = req.body.name;
                const trainer = new Trainer({name: name});

                trainer.save().then((data) => {
                    logI("Trainer registered: ", data);
                    res.status(200).send(data);
                }).catch((error) => {
                    logE(error);
                    res.status(500).send("internal server error");
                })
            }
        }
    });

    router.post("/addTrainerReview", (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const user = req.user as any;
            if (user) {
                const id = req.body._id;
                const review: string = req.body.review;
                logI(review);

                Trainer.findById(id).then(trainer => {
                    if (!trainer) {
                        return res.status(404).send('Trainer not found.');
                    }

                    const updatedReviews: string[] = trainer.reviews ? [...trainer.reviews, review] : [review];

                    Trainer.updateOne({ _id: id }, { name: trainer.name, reviews: updatedReviews }).then(() => {
                        logI("Review added to trainer: ", { id, review });
                        res.status(200).send({ message: 'Review added successfully' });
                    }).catch(error => {
                        logE('Error updating trainer:', error);
                        res.status(500).send('Internal server error.');
                    });
                }).catch(error => {
                    logE('Error finding trainer:', error);
                    res.status(500).send('Internal server error.');
                });
            } else {
                res.status(401).send("User not authorized");
            }
        } else {
            res.status(401).send("User not logged in");
        }
    });

    router.post("/deleteTrainer", (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const user = req.user as any;
            if (user && user.role === "admin") {
                const id = req.body._id;
                const query = Trainer.findById(id);
                query.then(async trainer => {
                    if (!trainer) {
                        return res.status(404).send('Trainer not found.');
                    }
                    Trainer.deleteOne({ _id: id }).then(() => {
                        logI('Trainer deleted: ', trainer);
                        res.status(200).json({message: 'Trainer deleted successfully.'});
                    }).catch(error => {
                        logE('Internal server error:', error);
                        res.status(500).send('Internal server error.');
                    });
                }).catch(error => {
                    logE('Error deleting trainer:', error);
                    res.status(500).send('Internal server error.');
                });

            }
        }
    });

    router.get("/home", (req: Request, res: Response) => {
        FitnessGroup.find().then((data) => {
            logI("FitnessGroups listed: ", data);
            res.status(200).send(data);
        }).catch((error) => {
            logE('', error);
            res.status(500).send("internal server error");
        });
    });

    router.get("/isadmin", (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const user = req.user as any;
            res.status(200).send(user && user.role === "admin");
            return;
        }
        res.status(200).send(false);
    });

    router.get("/isloggedin", (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);
            return;
        }
        res.status(200).send(false);
    });

    return router;
}