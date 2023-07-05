const { Schema, model, Types } = require("mongoose");
const moment = require("moment");

// Helper function to format date
const formatDate = (createdAtVal) => {
  return moment(createdAtVal).format("DD/MM/YYYY");
};

// Reaction Schema to be nested in Thought Schema
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
    get: formatDate,
  },
});

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: "Thought is required",
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: formatDate,
    },
    username: {
      type: String,
      required: "Username is required",
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
