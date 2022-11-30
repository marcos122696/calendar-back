//! Controllers
const { response } = require('express');
const Event = require('../models/EventModel');

const getEvents = async(req, res = response) => {
    
    const events = await Event.find().populate(
        'user',
        'name'
    ); 

    res.json({
        ok: true,
        events 
    });
};


const createEvent = async(req, res = response) => {
    
    const event = new Event( req.body );

    try {
        event.user = req.uid;
        const eventSaved = await event.save();

        res.status(200).json({
            ok: true,
            event: eventSaved,
            msg: 'Evento Guardado'
        })

    } catch (error) {
        // console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contactese con el damin XDD eVENTOS'
        })
    }
};


const updateEvent = async(req, res = response) => {
    
    const eventId = req.params.id;
    const uid = req.uid;

    try {

        const event = await Event.findById( eventId );
        // console.log( event.user == uid );

        if( !event ){
            return res.status(404).json({
                ok: false,
                msg: 'El evento no existe'
            })
        }

        if ( event.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No puede editar este evento, no esta autorizado'
            })
        }

        const newEvent = {
            ...req.body,
            user: uid
        };

        const eventUpdated = await Event.findByIdAndUpdate(
            eventId,
            newEvent,
            { new: true }
        );

        res.status(401).json({
            ok: true,
            event: eventUpdated
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contactese con el damin XDD eVENTOS'
        })
    }
};


const deleteEvent = async(req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {

        const event = await Event.findById( eventId );
        // console.log( event.user == uid );

        if( !event ){
            return res.status(404).json({
                ok: false,
                msg: 'El evento no existe'
            })
        }

        if ( event.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No puede eliminar este evento, no esta autorizado'
            })
        }

        await Event.findByIdAndDelete( eventId );

        res.json({ ok: true });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contactese con el damin XDD eVENTOS'
        })
    }
};


module.exports = {
    getEvents,
    createEvent ,
    updateEvent,
    deleteEvent,
};
