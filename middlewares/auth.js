const express = require('express');
const jwt = require('jsonwebtoken');
const errorHandler = require('./error');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    errorHandler(new Error('Unauthorized'), req, res);
    return;
  }

  const token = authHeader.split(' ')[1];

  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log({decoded});
    
    req.user = decoded;
    next();
  } catch (error) {
    errorHandler(new Error('Invalid token'), req, res);
    return;
  }
};

module.exports = authMiddleware;
