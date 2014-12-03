webApp.service('QSessionService', function() {
/**
 * QSession class
 */
  function QSession(sessionData)  {
    this.sessionData = sessionData || [];
    this.maxVisitCount = this.getMaxVisitCount();
    this.minVisitCount = this.getMinVisitCount();
    this.totalVisitCount = this.getTotalVisitCount();
  };
  QSession.prototype.getMaxVisitCount = function()  {
    var total = 0;
    if (this.sessionData.lstPageSummary)  {
      this.sessionData.lstPageSummary.forEach(function(tmpPage) {
        total = Math.max(total, tmpPage.visitCount);
      });
    };
    return total;
  };
  QSession.prototype.getMinVisitCount = function()  {
    var total = this.maxVisitCount;
    if (!this.sessionData.lstPageSummary) {
      this.sessionData.lstPageSummary = [];
    }
    this.sessionData.lstPageSummary.forEach(function(tmpPage) {
      total = Math.min(total, tmpPage.visitCount);
    });
    return total;
  };
  QSession.prototype.getPageSummaryById = function(pageId)  {
    var result = null;
    if (this.sessionData.lstPageSummary)  {
      this.sessionData.lstPageSummary.forEach(function(tmpPage) {
        if (tmpPage.id == pageId) {
          result = tmpPage;
          return;
        }
      });
    }
    return result;
  };
  QSession.prototype.getTotalVisitCount = function(){
    var total = 0;
    if (this.sessionData.lstPageSummary) {
      this.sessionData.lstPageSummary.forEach(function(tmpPage) {
        total += tmpPage.visitCount;
      });
    };
    return total;
  };
  this.initialized = function(session) {
    return new QSession(session);
  }
})
