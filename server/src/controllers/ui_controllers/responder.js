module.exports = {
  json: function(req, res, data, err) {
    const token = req.res.locals.newToken;
    res.json({
      token,
      data,
      err
    });
  },
}
