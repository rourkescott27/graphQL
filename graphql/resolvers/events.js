const Event = require('../../models/event');

const { transformEvent } = require('./merge');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            });
        } catch (err) {
            throw err;
        }
    },
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "669b9da1d8ba0f1efabfc9c2" //* Dummy user ID for now. Replace with actual user ID when implementing authentication and authorization.
        });
        let createdEvent;
        try {
            const result = await event.save()
            createdEvent = transformEvent(result);
            const creator = await User.findById("669b9da1d8ba0f1efabfc9c2");

            if (!creator) {
                throw new Error("User not found !!")
            }
            creator.createdEvents.push(event);
            await creator.save();

            return createdEvent;
        } catch (err) {
            console.log(err);
            throw err;
        };
    }
};
