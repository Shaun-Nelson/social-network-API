const User = require("../models/User");
const Thought = require("../models/Thought");

// Seed data for Users
const userSeedData = [
  {
    username: "user1",
    email: "user1@example.com",
    thoughts: [],
    friends: [],
  },
  {
    username: "user2",
    email: "user2@example.com",
    thoughts: [],
    friends: [],
  },
];

// Seed data for Thoughts
const thoughtSeedData = [
  {
    thoughtText: "This is a thought by user1",
    username: "user1",
    reactions: [],
  },
  {
    thoughtText: "This is a thought by user2",
    username: "user2",
    reactions: [],
  },
];

// Function to seed data
async function seedData() {
  try {
    // Clear existing data
    await User.deleteMany();
    await Thought.deleteMany();

    // Seed Users
    const users = await User.create(userSeedData);

    // Seed Thoughts
    const thoughts = await Thought.create(thoughtSeedData);

    // Associate Thoughts with Users
    for (let i = 0; i < thoughts.length; i++) {
      const thought = thoughts[i];
      const user = users.find((user) => user.username === thought.username);
      user.thoughts.push(thought._id);
      await user.save();
    }

    console.log("Seed data created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

// Invoke the seedData function
seedData();
