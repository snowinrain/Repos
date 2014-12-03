webApp.provider('SessionProvider', function(){
  var Value = {};
  var Sessions = function(){
    this.sessionData = {};
    this.data = {};
    this.$http = {};
    var appTesters = [],
        appStDate = [],
        appEndDate = [],
        filterTesters = null,
        filterStDate = null,
        filterEndDate = null;
    //
    this.init = function($http){
      Value.IS_FIRST_FILL_SESSION = true;
      this.$http = $http;
      return this;
    }
    // find all
    this.findAll = function(pid){
      var self = this;
      return self.$http.get(API_HOST+Value.jsconf.urlProjectPageSession).then(function(result){
        self.data = result.data;
        return self;
      })
//      return self.$http.get("./session.json").then(function(result) {
//        self.data = result.data;
//        return self;
//      });
    }
    // start Date of all session
    this.findAppStartDate = function() {
      return appStDate;
    }
    // end Date of all session
    this.findAppEndDate = function() {
      return appEndDate;
    }
    // all testers
    this.findAppTesters = function() {
      return appTesters;
    }
    // current testers
    this.findFilterTesters = function() {
      return filterTesters || appTesters;
    }
    // current stDate
    this.findFilterStDate = function() {
      return filterStDate || appStDate;
    }
    // current endDate
    this.findFilterEndDate = function() {
      return filterEndDate || appEndDate;
    }
    // analysis datas
    this.analysis = function(miliStart, miliEnd, testers){
      var sessions = this.data,
          lstPageID = [],
          lstPageSummary = [],
          dataSession = {},
          timeCreated = '',
          tester = '',
          ANALYSIS_ALL = (arguments.length == 0),
          firstTime = true,
          self = this;
      sessions.forEach(function(session){
        timeCreated = session["processedTime"];
        tester = session["tester"];
        filterTesters = testers;
        filterStDate = miliStart;
        filterEndDate = miliEnd;
        if (ANALYSIS_ALL) {
          push.apply(appTesters,[tester])
          if (firstTime) {
            appStDate = timeCreated;
            appEndDate = timeCreated;
            firstTime = false;
          } else {
            appStDate = saveMin(appStDate, timeCreated);
            appEndDate = saveMax(appEndDate, timeCreated);
          }
        };
        if ((timeCreated >= miliStart
            && timeCreated <= miliEnd
            && contain.apply(testers,[tester]))
            ||ANALYSIS_ALL) {
          session["lstPageSummary"].forEach(function(pageSummary)  {
            var pageId = pageSummary["id"];
            if (contain.apply(lstPageID, [pageId])) {
              var pageSummaryStored = lstPageSummary[lstPageID.indexOf(pageId)];
              pageSummaryStored["bugCount"] += pageSummary["bugCount"];
              pageSummaryStored["concernCount"] += pageSummary["concernCount"];
              pageSummaryStored["noteCount"] += pageSummary["noteCount"];
              pageSummaryStored["questionCount"] += pageSummary["questionCount"];
              pageSummaryStored["visitCount"] += pageSummary["visitCount"];
            } else {
              lstPageID.push(pageId);
              var newPageSummary = {
                  "id":pageSummary["id"],
                  "bugCount": pageSummary["bugCount"],
                  "concernCount": pageSummary["concernCount"],
                  "noteCount": pageSummary["noteCount"],
                  "questionCount": pageSummary["questionCount"],
                  "visitCount": pageSummary["visitCount"],
              };
              lstPageSummary.push(newPageSummary);
            }
          });
        }
      })
      if (ANALYSIS_ALL){
        Value.maxVisitCount = 0;
        lstPageSummary.forEach(function(pageSummary)  {
          Value.maxVisitCount = Math.max(Value.maxVisitCount, pageSummary["visitCount"]);
        });
      }
      dataSession["lstPageSummary"] = lstPageSummary;
      this.sessionData = dataSession;
      return this;
    }
  }
  // contain tester
  var contain = function(x){
    return this.indexOf(x) != -1;
  }
  var push = function(x){
    if(!contain.apply(this,[x])){
      this.push(x);
    }
  }
  var saveMin = function(x, y){
    return Math.min(x, y);
  }
  var saveMax = function(x, y){
    return Math.max(x, y);
  }
  //
  var session = new Sessions();
  this.$get = function($http, MapValue){
    Value = MapValue;
    return session.init($http);
  }
})

