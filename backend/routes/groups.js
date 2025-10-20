const express = require('express');
const router = express.Router();
const GroupController = require('../controllers/groupController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, GroupController.createGroup);
router.get('/', GroupController.listGroups);
router.get('/:id', GroupController.getGroup);
router.put('/:id', authenticate, GroupController.updateGroup);
router.delete('/:id', authenticate, GroupController.deleteGroup);

router.post('/:id/join', authenticate, GroupController.joinGroup);
router.post('/:id/leave', authenticate, GroupController.leaveGroup);
router.get('/:id/members', authenticate, GroupController.getMembers);
router.get('/:id/activity', authenticate, GroupController.getActivity);
router.post('/:id/members/role', authenticate, GroupController.updateMemberRole);
router.post('/:id/members/remove', authenticate, GroupController.removeMember);

module.exports = router;
