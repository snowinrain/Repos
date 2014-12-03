webApp.service('MapService', function($http, $location, $cookies, MapValue) {
    this.getParentChildMap = function() {
        console.log(MapValue.jsconf.urlProjectMetaMap);
//        return $.getJSON("./page-list.json", function(data) {
//
//            console.log(data);
//            return data;
//        });

      return $http.get(API_HOST + MapValue.jsconf.urlProjectMetaMap).then(function(result) {
        return result.data;
      });
    };
    this.getJsConfig = function() {
        var pid = $cookies.pid || MapValue.cookie;
        console.log(pid);
        return $http.get(API_HOST + 'setting/project/' + pid + '/jsconfig').then(function(result) {
            return result.data;
        });
    };
    this.getMapSetting = function(args) {
        console.log(MapValue.jsconf.urlProjectMapSetting);
        return $http.post(API_HOST + MapValue.jsconf.urlProjectMapSetting, args).then(function(result) {
            return result.data;
        })
    };
    this.ChangeToFirstTime = function(args) {
        console.log(MapValue.jsconf.urlProjectUpdateFirstTime)
        return $http.post(API_HOST + MapValue.jsconf.urlProjectUpdateFirstTime, args).then(function(result) {
            return result.data;
        })
    };
    this.saveMap = function(args) {
        console.log(MapValue.jsconf.urlProjectMapPagesAdd)
        return $http.post(API_HOST + MapValue.jsconf.urlProjectMapPagesAdd, args).then(function(result) {
            return result.data;
        })
    };
    this.updateMapAndZoom = function(args) {
        return $http.post(API_HOST + MapValue.jsconf.urlProjectUpdateMapXYAndLevelZoom, args).then(function(r) {
            return r.data;
        })
    };
    this.pushPages = function(args) {
        console.log('save with mapId ----> ' + args.mapId)
        return $http.post(API_HOST + MapValue.jsconf.urlProjectMapPagesUpdate, args).then(function(r) {
            return r.data;
        })
    };
   this.getLocalProjects = function(from, to) {
        console.log(from);
        console.log(to);
        // empty for all project
        // page/project?dateStart=..&dateEnd=..
        return $http.get(API_HOST + 'project').then(function(result) {
            return result.data;
        });
    }
    this.getqTestProjects = function() {
        // TODO: do we need to get project from API, or only get from DB
        console.log($cookies.token)
        return $http.post(API_HOST + 'getqTestProject', {
            token: $cookies.token
        }).then(function(result) {
            return result.data;
        })
    }
    this.checkProjectUser = function(pid) {
        console.log(pid)
        return $http.post(API_HOST + 'project/' + pid + '/userproject/checkuserproject', {
            userId: MapValue.userSettings.userId
        }).then(function(result) {
            return result.data;
        });
    }
    this.createUserProject = function(pid, userProject) {
        console.log(userProject);
        console.log(pid)
        return $http.post(API_HOST + 'project/' + pid + '/userproject/saveuserproject', userProject, function(result) {
            return result.data;
        })
    }
    this.saveFilter = function(filter) {
        console.log(MapValue.jsconf.urlProjectSaveFilter)
        console.log(filter)
        return $http.post(API_HOST + MapValue.jsconf.urlProjectSaveFilter, filter).then(function(result) {
            return result.data;
        })
    };
    this.getFilter = function(userId) {
        console.log(MapValue.jsconf.urlProjectGetFilter)
        console.log(userId)
        return $http.post(API_HOST + MapValue.jsconf.urlProjectGetFilter, {
            userId: userId
        }).then(function(result) {
            return result.data;
        })
    };
    this.getTesters = function() {
        console.log(MapValue.jsconf.urlProjectMetaMap)
        return $http.get(API_HOST + MapValue.jsconf.urlProjectMetaMap).then(function(r) {
            return r.data;
        })
    };
    this.evaluateToken = function(token) {
        return $http.post(API_HOST + 'user/evaluate', token).then(function(result) {
            return result.data;
        })
    };
    this.deleteFilter = function(token, filterId) {
        console.log("deleteFilter");
        return $http.post(API_HOST + MapValue.jsconf.urlProjectDeleteFilter, {
            token: token,
            filterId: filterId
        }).then(function(result) {
            return result.data;
        })
    };
})
