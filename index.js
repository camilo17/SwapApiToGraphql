const { GraphQLServer } = require("graphql-yoga");
const fetch = require("node-fetch");

const typeDefs = `
    type Query {
        hello(name: String!): String!
        getPerson(id: Int!): Person!
    }

    type Film {
        title: String,
        episode_id: String,
        director: String,
        producer: String,
        release_date: String
        characters: [Person]
    }


    type Person {
        name: String,
        height: String,
        mass: String,
        hair_color: String,
        skin_color: String,
        eye_color: String,
        birth_year: String,
        gender: String
        films: [Film!]
    }

`;

const resolvers = {
  Film: {
    characters: (parent, args, context, info) => {
      const response = parent.characters.map(url => {
        return fetch(url).then(res => res.json());
      });

      return response;
    }
  },
  Person: {
    films: (parent, args, context, info) => {
      const response = parent.films.map(film => {
        return fetch(film).then(res => res.json());
      });

      return response;
    }
  },

  Query: {
    hello: (parent, args, context, info) => `Hello ${args.name}`,
    getPerson: (parent, { id }, context, info) => {
      const person = fetch(`http://swapi.co/api/people/${id}/`).then(res =>
        res.json()
      );

      return person;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log("Server is running on localhost:4000"));
