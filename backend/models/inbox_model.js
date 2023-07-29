import mongoose from "mongoose";

const no_spacenum = (value) => {
    return !/[0-9 ]/.test(value);
};

const size_validation = (value) => {
    return value.length <= 16 && value.length >= 3;
};

const inbox_data = {
    space_name: {
        type: String,
        required: true,
        min: 2,
        max: 16,
        validate: [
            {
                validator: no_spacenum,
                message: "Numbers and spaces not allowed"
            },
            {
                validator: size_validation,
                message: "Shouldn't be less than 3 or more than 16",
            },
        ]
    },
    space_text: {
        type: String,
        default: ""
    },
    removal: {
        type: Number,
        default: 0
    },
    expireAt: {
        type: Date,
        default: Date.now
    }
};

const Schema = mongoose.Schema;
const inbox_schema = new Schema(inbox_data, { timestamps: true });

inbox_schema.index({ expireAt: 1 }, { expireAfterSeconds: 60 });

export default mongoose.model("inbox", inbox_schema);