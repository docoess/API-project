const express = require('express');
const router = express.Router();

router.get('/api/csrf/restore', (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie('XSRF-TOKEN', csrfToken);
  res.status(200).join({
    'XSRF-TOKEN': csrfToken
  });
});

module.exports = router;
