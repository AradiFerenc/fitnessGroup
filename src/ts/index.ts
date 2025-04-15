import express, {Request, Response} from "express";

class MainClass {
    constructor() {
        console.log("Hello, TypeScript!");
    }
}

let myClass = new MainClass();

const app = express();
const port = 5000;

app.get('/', (req: Request, res: Response) => {
    let myClass = new MainClass();
    res.status(200).send('Hello World!');
})
app.listen(port, () => {
    console.log("Server started on port " + port);
});