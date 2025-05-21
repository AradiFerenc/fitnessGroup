import mongoose, {Document, Schema} from "mongoose";


interface IFitnessGroup extends Document {
    name: string;
    trainer: string;
    startTime: string;
    endTime: string;
    description: string;
    users: string[];
}

const FitnessGroupSchema: Schema<IFitnessGroup> = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    trainer: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    users: [{
        type: String,
        required: true,
        default: [String]
    }]
});

export const FitnessGroup = mongoose.model<IFitnessGroup>('FitnessGroup', FitnessGroupSchema);
