import mongoose from "mongoose"

const inbox_data = {
    space_name: {
        type: String,
        required: true,
        min: 2,
        max: 20
    },
    space_text: {
        type: String,
        default: ""
    },
    removal: {
        type: Number,
        default: 0,
    },
    expireAt: {
        type: Date,
        default: Date.now
    }
}

const Schema = mongoose.Schema;
const inbox_schema = new Schema(inbox_data, { timestamps: true });

inbox_schema.index({ expireAt: 1 }, { expireAfterSeconds: 60 });

export default mongoose.model("inbox", inbox_schema);