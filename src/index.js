const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

const posts = [
	{
		id: 1,
		title: 'Article one',
		content: 'This is Article One'
	},
	{
		id: 2,
		title: 'Article Two',
		content: 'This is Article Two'
	},
	{
		id: 3,
		title: 'Article Three',
		content: 'This is Article Three'
	}
];


const resolvers = {
	Query: {
		notes: async (_, args, context, info) => {
			const notes = await context.db.query.notes(null, info);
			return notes;
		},
		note: async (_, args, context, info) => {
			const note = await context.db.query.note({
				where: {
					id: args.where.id
				}
			}, info);
			return note;
		}
	},
	Mutation: {
		createNote: async (_, args, context, info) => {
			const note = await context.db.mutation.createNote({
				data: {
					title: args.data.title,
					content: args.data.content
			}}, info);
			return note;
		},
		updateNote: async (_, args, context, info) => {
			const note = await context.db.mutation.updateNote({
				where: { id: args.where.id },
				data: {
					title: args.data.title,
					content: args.data.content
				}
			}, info)
			return note;
		},
		deleteNote: async (_, args, context, info) => {
			const note = await context.db.mutation.deleteNote({
				where: { id: args.where.id }
			}, info)
			return note;
		}
	}
}

const server = new GraphQLServer({
	typeDefs: './src/generated/prisma.graphql',
	resolvers,
	context: {
		db: new Prisma({
			typeDefs: './src/generated/prisma.graphql',
			endpoint: 'https://eu1.prisma.sh/gbolahan-olawuyi/note-app/dev'
		})
	}
});
server.start(() => console.log('Server is running on localhost:4000'));