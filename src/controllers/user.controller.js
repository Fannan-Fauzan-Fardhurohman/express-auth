class UserController {
  getProfile(req, res) {
    // req.user is set by auth middleware
    res.status(200).json({
      message: 'Profile retrieved successfully',
      user: req.user,
    });
  }

  getManagerData(req, res) {
    res.status(200).json({
      message: 'Welcome Manager!',
      data: 'This data is for managers and admins only.',
      user: req.user
    });
  }

  getAdminData(req, res) {
    res.status(200).json({
      message: 'Welcome Admin!',
      data: 'This is highly sensitive data for admins only.',
      user: req.user
    });
  }
}

module.exports = new UserController();
