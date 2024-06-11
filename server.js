import { ApolloServer, gql } from "apollo-server";

// 가짜 DB
let tweets = [
  {
    id: "1",
    text: "First one",
    userId: "2",
  },
  {
    id: "2",
    text: "Second one",
    userId: "1",
  },
];

// 가짜 DB
let users = [
  {
    id: "1",
    firstName: "fname",
    lastName: "lname",
  },
  {
    id: "2",
    firstName: "Elon",
    lastName: "Musk",
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
  }
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;

const resolvers = {
  // Query resolver
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers() {
      console.log("allUsers called");
      return users;
    },
  },
  // Mutation resolver
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
        userId,
      };
      const user = users.find((user) => user.id === userId);
      if (!user) {
        return null;
      }
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  // Type resolver
  User: {
    firstName({ firstName }) {
      return firstName;
    },
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
  },
  // Type resolver
  Tweet: {
    author({ userId }) {
      // user와 tweet을 join
      const user = users.find((user) => user.id === userId);
      if (!user) {
        return null;
      }
      return user;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
