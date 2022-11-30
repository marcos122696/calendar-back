//! Controllers createUser
const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const { generateJWT } = require('../helpers/jwt');

const createUser = async( req, res = response ) => {
// req = lo que el usuario solicita / res = lo que respondo.
    const { email, password, name } = req.body;
    // Todo: Manejar el name, cuadno viene un string vacio.
    try {
        let user = await User.findOne({ email });
        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            });
        }
        user = new User( req.body );
        
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );
        
        await user.save();
        //--- GENERAR TOKEN ---//
        const token = await generateJWT( user.id, user.name );
     
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comuniquece con el administrador XD'
        });
    }
}

const loginUser = async( req, res = response ) => {
    
    const { email, password } = req.body;
    try {
        
        const user = await User.findOne({ email });
        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no esta registrado'
            });
        }
        //! Confirmar contraseñas.
        const validPassword = bcrypt.compareSync( password, user.password );
        console.log(validPassword);
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });
        }

         //--- GENERAR TOKEN ---//
         const token = await generateJWT( user.id, user.name );

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comuniquece con el administrador XD'
        });
    }
}

const reToken = async( req, res = response ) => {

    const { uid, name } = req;

    //--- GENERAR TOKEN ---//
    const token = await generateJWT( uid, name );

    res.json({
        ok: true,
        uid, name,
        token
    });
}

module.exports = {
    createUser,
    loginUser,
    reToken,
};