const followService = require('./followService');
const { success, error } = require('../../middlewares/apiResponse');

function parseUserId(req, res) {
  const rawId = req.params.userId;
  if (!/^[1-9]\d*$/.test(rawId)) {
    error(res, 'O id do usuário deve ser um inteiro positivo.', 400);
    return null;
  }

  const userId = Number(rawId);
  if (!Number.isSafeInteger(userId)) {
    error(res, 'O id do usuário deve ser um inteiro positivo.', 400);
    return null;
  }
  return userId;
}

exports.toggleFollow = async (req, res) => {
  const userId = parseUserId(req, res);
  if (userId === null) return;

  const result = await followService.toggleFollow(Number(req.user.id), userId);
  return success(
    res,
    result,
    result.isFollowing ? 'Agora você está seguindo este usuário.' : 'Você deixou de seguir este usuário.',
    result.isFollowing ? 201 : 200
  );
};

exports.getFollowStatus = async (req, res) => {
  const userId = parseUserId(req, res);
  if (userId === null) return;
  const result = await followService.getFollowStatus(Number(req.user.id), userId);
  return success(res, { isFollowing: result });
};

exports.getFollowers = async (req, res) => {
  const userId = parseUserId(req, res);
  if (userId === null) return;
  const followers = await followService.getFollowers(userId);
  return success(res, followers);
};

exports.getFollowing = async (req, res) => {
  const userId = parseUserId(req, res);
  if (userId === null) return;
  const following = await followService.getFollowing(userId);
  return success(res, following);
};
