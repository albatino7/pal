const followModel = require("../model/follow.model");

const followUserController = async (req, res) => {
  const followerID = req.user.userid;
  const followeeID = req.params.id;

  //   console.log(followerID, followeeID);

  if (followerID === followeeID) {
    return res.status(400).json({
      message: "You cannot follow ::YourSelf::",
    });
  }

  const ifAlreadyFollow = await followModel.findOne({
    follower: followerID,
    followe: followeeID,
  });

  if (ifAlreadyFollow) {
    return res.status(400).json({
      message: "Your ALREADY Follow this user ",
    });
  }

  const followDone = await followModel.create({
    follower: followerID,
    followe: followeeID,
  });

  res.status(200).json({
    message: "Your Following Now ",
    followDone,
  });
};

const unfollowUserController = async (req, res) => {
  const followerID = req.user.userid;
  const followeeID = req.params.id;

  const checkFollow = await followModel.findOne({
    follower: followerID,
    followe: followeeID,
  });

  if (!checkFollow) {
    return res.status(400).json({
      message: "Your are not Following This user Yet ",
    });
  }

  const unfollowDone = await followModel.findByIdAndDelete(checkFollow._id);

  res.status(200).json({
    message: "You Unfollow This User",
  });
};
module.exports = { followUserController, unfollowUserController };
