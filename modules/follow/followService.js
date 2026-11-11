const sequelize = require('../../config/database');
const Follow = require('./followModel');
const User = require('../user/userModel');

function notFound(message) {
  const error = new Error(message);
  error.status = 404;
  return error;
}

async function toggleFollow(followerId, followingId) {
  const follower = Number(followerId);
  const following = Number(followingId);

  if (follower === following) {
    const error = new Error('Você não pode seguir a si mesmo.');
    error.status = 400;
    throw error;
  }

  const target = await User.findByPk(following);
  if (!target) {
    throw notFound('Usuário não encontrado.');
  }

  const transaction = await sequelize.transaction();
  try {
    const [, created] = await Follow.findOrCreate({
      where: { followerId: follower, followingId: following },
      defaults: { followerId: follower, followingId: following },
      transaction
    });

    if (created) {
      await User.increment('followersCount', {
        where: { id: following },
        transaction
      });
      await User.increment('followingCount', {
        where: { id: follower },
        transaction
      });
    } else {
      await Follow.destroy({
        where: { followerId: follower, followingId: following },
        transaction
      });
      await User.decrement('followersCount', {
        where: { id: following },
        transaction
      });
      await User.decrement('followingCount', {
        where: { id: follower },
        transaction
      });
    }

    await target.reload({ transaction });
    await transaction.commit();

    return {
      isFollowing: created,
      followersCount: target.followersCount
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function getFollowStatus(followerId, followingId) {
  const target = await User.findByPk(Number(followingId));
  if (!target) {
    throw notFound('Usuário não encontrado.');
  }
  const follow = await Follow.findOne({
    where: { followerId: Number(followerId), followingId: Number(followingId) }
  });
  return !!follow;
}

async function getFollowers(userId) {
  const target = await User.findByPk(Number(userId));
  if (!target) {
    throw notFound('Usuário não encontrado.');
  }

  const follows = await Follow.findAll({
    where: { followingId: Number(userId) },
    include: [{
      model: User,
      as: 'Follower',
      attributes: ['id', 'username', 'fullName', 'profilePicture', 'followersCount', 'followingCount']
    }],
    order: [['createdAt', 'DESC']]
  });

  return follows.map(follow => follow.Follower);
}

async function getFollowing(userId) {
  const target = await User.findByPk(Number(userId));
  if (!target) {
    throw notFound('Usuário não encontrado.');
  }

  const follows = await Follow.findAll({
    where: { followerId: Number(userId) },
    include: [{
      model: User,
      as: 'Following',
      attributes: ['id', 'username', 'fullName', 'profilePicture', 'followersCount', 'followingCount']
    }],
    order: [['createdAt', 'DESC']]
  });

  return follows.map(follow => follow.Following);
}

module.exports = { toggleFollow, getFollowStatus, getFollowers, getFollowing };
