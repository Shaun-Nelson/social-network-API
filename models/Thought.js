const { Schema, model } = require("mongoose");

const reactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  reactionBody: {
    type: String,
    required: "Reaction is required",
    maxLength: 280,
  },
  username: {
    type: String,
    required: "Username is required",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (createdAtVal) => createdAtVal.toLocaleDateString(),
  },
});

const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: "Thought is required",
    minLength: 1,
    maxLength: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (createdAtVal) => createdAtVal.toLocaleDateString(),
  },
  username: {
    type: String,
    required: "Username is required",
  },
  reactions: [reactionSchema],
});

thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
