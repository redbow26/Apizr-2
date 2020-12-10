require('dotenv').config();
const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const fetch = require('node-fetch');

const { toHex } = require('./color');

const PORT = process.env.PORT || 3001;

const app = express();

const typeDefs = gql`
    type People {
        name: String
        height: String
        mass: String
        hair_color: Color
        skin_color: Color
        eye_color: Color
        birth_year: String
        gender: String
        homeworld: String
        films: [String]
        species: [String]
        vehicles: [String]
        starships: [String]

    }
    
    type hex {
        value: String!,
        clean: String!
    }
    
    type rgb {
        value: String!
    }
    
    type hsl {
        value: String!
    }
    
    type hsv {
        value: String!
    }
    
    type cmyk {
        value: String!
    }
    
    type XYZ {
        value: String!
    }
    
    type Color {
        hex: hex
        rgb: rgb
        hsl: hsl
        hsv: hsv
        name: String!
        cmyk: cmyk
        XYZ: XYZ
    }
    
    type Query {
        people(name: String!): People
    }
    
`

const resolvers = {
    Query: {
        people: async (_, {name}) => {
            let data = await fetch(`https://swapi.dev/api/people/?search=${name}`);
            const jsonData = await data.json();
            if (jsonData) {
                const result = jsonData.results[0];
                let hairColor = result.hair_color
                let skinColor = result.skin_color
                let eyeColor = result.eye_color

                if (hairColor !== "n/a") {
                    let color = toHex(hairColor);
                    if (color) {
                        color = color.substring(1);
                        let dataC = await fetch(`https://www.thecolorapi.com/id?hex=${color}`);
                        dataC = await dataC.json();
                        hairColor = {
                            hex: { value: dataC.hex.value },
                            rgb: { value: dataC.rgb.value },
                            hsl: { value: dataC.hsl.value },
                            hsv: { value: dataC.hsv.value },
                            name: dataC.name.value,
                            cmyk: { value: dataC.cmyk.value },
                            XYZ: { value: dataC.XYZ.value },
                        }
                    } else {
                        hairColor = {name: hairColor};
                    }
                } else {
                    hairColor = {name: "n/a"};
                }

                if (skinColor !== "n/a") {
                    let color = toHex(skinColor);
                    if (color) {
                        color = color.substring(1);
                        let dataC = await fetch(`https://www.thecolorapi.com/id?hex=${color}`);
                        dataC = await dataC.json();
                        skinColor = {
                            hex: {value: dataC.hex.value},
                            rgb: {value: dataC.rgb.value},
                            hsl: {value: dataC.hsl.value},
                            hsv: {value: dataC.hsv.value},
                            name: dataC.name.value,
                            cmyk: {value: dataC.cmyk.value},
                            XYZ: {value: dataC.XYZ.value},
                        }
                    } else {
                        skinColor = {name: skinColor};
                    }
                } else {
                    skinColor = {name: "n/a"};
                }

                if (eyeColor !== "n/a") {
                    let color = toHex(eyeColor);
                    if (color) {
                        color = color.substring(1);
                        let dataC = await fetch(`https://www.thecolorapi.com/id?hex=${color}`);
                        dataC = await dataC.json();
                        eyeColor = {
                            hex: { value: dataC.hex.value },
                            rgb: { value: dataC.rgb.value },
                            hsl: { value: dataC.hsl.value },
                            hsv: { value: dataC.hsv.value },
                            name: dataC.name.value,
                            cmyk: { value: dataC.cmyk.value },
                            XYZ: { value: dataC.XYZ.value },
                        }
                    } else {
                        eyeColor = {name: eyeColor};
                    }
                } else {
                    eyeColor = {name: "n/a"};
                }
                let people = {
                    name: result.name,
                    height: result.height,
                    mass: result.mass,
                    hair_color: hairColor,
                    skin_color: skinColor,
                    eye_color: eyeColor,
                    birth_year: result.birth_year,
                    gender: result.gender,
                    homeworld: result.homeworld,
                    films: result.films,
                    species: result.species,
                    vehicles: result.vehicles,
                    starships: result.starships
                }
                return people;
            }
            return null;
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.applyMiddleware({ app });

app.listen(PORT, () => {
    console.log(`server ready at http://localhost:${PORT}${server.graphqlPath}`)
})
