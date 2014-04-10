'use strict';

// group routes use group controller
var group = require('../controllers/group');


module.exports = function(app) {
  app.get('/group/getgroups',group.getGroups);
  app.get('/group/savegroups',group.saveGroups);

  app.get('/group/getCompanyGroups/:id', group.getCompanyGroups);
  app.get('/group/getCompanyGroups', group.getCompanyGroups);


  app.get('/group/getAccount', group.getAccount);
  app.get('/group/getInfo', group.getInfo);
  app.get('/group/info/:groupId', group.Info);
  app.get('/group/info', group.Info);
  app.get('/group/member/:groupId', group.member);
  app.get('/group/member', group.member);
  app.post('/group/saveInfo', group.saveInfo);

  //获取小组活动列表
  app.get('/group/campaign', group.getGroupCampaign);
  app.get('/group/groupMessage', group.getGroupMessage);
  //小组发布活动
  app.get('/group/campaignSponsor', group.showSponsor);
  app.post('/group/campaignSponsor', group.sponsor);
  app.param('groupId',group.group);
};
