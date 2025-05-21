import mongoose, {Document, Schema} from "mongoose";


interface ITrainer extends Document {
    name: string;
    reviews: string[];
}

const TrainerSchema: Schema<ITrainer> = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    reviews: {
        type: [String],
        required: false,
    },
});

export const Trainer = mongoose.model<ITrainer>('Trainer', TrainerSchema);
