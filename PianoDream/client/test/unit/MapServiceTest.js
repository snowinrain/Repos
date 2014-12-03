/*
    This test based on webservice new UI
    Please reference the result of http://qmap.kms-technology.com/newUI
    @author: tuanle
*/
setTimeout(function(){
  runTest();
}, 300);


function runTest() {
describe('MapService', function(){
  var injector = angular.element(document.body).injector();
  var service = injector.get('MapService');
  var $cookies = injector.get('$cookies');
  var MapValue = injector.get('MapValue');

  var expect = chai.expect;
  var should = chai.should;
  var assert = chai.assert;

    // constant
  var PROJECT_ID = '6873';
  var TOKEN = '68855855-f00c-4479-ba63';
  var FILTER_TOKEN = 'bmVwaGVsZXxuZXBoZWxlcHJvQGdtYWlsLmNvbToxNDM5ODcxNjM4ODA2OjQ4OWZkNTNlNzcxMzRlYWFmYzM1NmQ1YjEzNzBmNTc4';
  var USER_ID = "nephelepro@gmail.com";
  var FILTER_ID_CACHED = '';

  var jsConfig;
  
    // set mocha timeout
    // this.timeout(5000);

  beforeEach(function(done){
    $cookies.pid = PROJECT_ID;
    done();
  });
  
    /*
    getJSConfig
    */
    describe('getJsConfig', function(){
      beforeEach(function(done){
        service.getJsConfig().then(function(result){
          jsConfig = result;
          MapValue.jsconf = result;
          done();
        });
      });

        it('should have a valid config for project ', function(done){
          expect(jsConfig).to.exist;
          done();
        });

        it('should have a defToken', function(done){
          expect(jsConfig.defToken).to.exist;
          done();
        });
    it('should have a project setting as an object', function(done){
          expect(jsConfig.projectSetting).to.be.an('object');
          done();
        });

        it('should have url project delete filter', function(done){
          expect(jsConfig.urlProjectDeleteFilter).to.exist;
          done();
        });

        it('should have url project get filter', function(done){
          expect(jsConfig.urlProjectGetFilter).to.exist;
          done();
        });

        it('should have url project map page add', function(done){
          expect(jsConfig.urlProjectMapPagesAdd).to.exist;
          done();
        });

        it('should have url project map page update', function(done){
          expect(jsConfig.urlProjectMapPagesUpdate).to.exist;
          done();
        });

        it('should have url project map setting', function(done){
          expect(jsConfig.urlProjectMapSetting).to.exist;
          done();
        });

        it('should have url project meta map', function(done){
          expect(jsConfig.urlProjectMetaMap).to.exist;
          done();
        });

        it('should have url project page session', function(done){
          expect(jsConfig.urlProjectPageSession).to.exist;
          done();
        });

        it('should have url project save filter', function(done){
          expect(jsConfig.urlProjectSaveFilter).to.exist;
          done();
        });

        it('should have url project update end date', function(done){
          expect(jsConfig.urlProjectUpdateDateEnd).to.exist;
          done();
        });

        it('should have url project update start date', function(done){
          expect(jsConfig.urlProjectUpdateDateStart).to.exist;
          done();
        });

        it('should have url project update first time', function(done){
          expect(jsConfig.urlProjectUpdateFirstTime).to.exist;
          done();
        });

        it('should have url project update level expand', function(done){
          expect(jsConfig.urlProjectUpdateLevelExpand).to.exist;
          done();
        });

        it('should have url project update level zoom', function(done){
          expect(jsConfig.urlProjectUpdateLevelZoom).to.exist;
          done();
        });

        it('should have url project update map type', function(done){
          expect(jsConfig.urlProjectUpdateMapType).to.exist;
          done();
        });

        it('should have url project update map xy', function(done){
          expect(jsConfig.urlProjectUpdateMapXY).to.exist;
          done();
        });

        it('should have url project update map xy and zoom level', function(done){
          expect(jsConfig.urlProjectUpdateMapXYAndLevelZoom).to.exist;
          done();
        });

        it('should have url project update max visit count', function(done){
          expect(jsConfig.urlProjectUpdateMaxVisitCount).to.exist;
          done();
        });

        it('should have url project update show bugs', function(done){
          expect(jsConfig.urlProjectUpdateShowBugs).to.exist;
          done();
        });

        it('should have url project update show notes', function(done){
          expect(jsConfig.urlProjectUpdateShowNotes).to.exist;
          done();
        });

        it('should have url project update show questions', function(done){
          expect(jsConfig.urlProjectUpdateShowQuestions).to.exist;
          done();
        });

        it('should have url project update show suggestions', function(done){
          expect(jsConfig.urlProjectUpdateShowSuggestions).to.exist;
          done();
        });
    });

    /*
        getMetaMap
    */
    describe('getMetaMap', function(){
        var map;
        beforeEach(function(done){
            service.getMetaMap().then(function(metaMap){
                map = metaMap;
                done();
            });
        });
        it('should have a valid meta map', function(done){
            expect(map).to.exist;
            done();
        });

        it('should have accuracy with in [0..10]', function(done){
            expect(map.accuracy).to.be.within(0, 10);
            done();
        });

        it('should have all related node as an array', function(done){
            expect(map.allRelatedNode).to.be.instanceOf(Array);
            done();
        });

        it('should have archive attribute', function(done){
            expect(map.archive).to.exist;
            done();
        });

        it('should have an array of children', function(done){
            expect(map.children).to.be.instanceOf(Array);
            done();
        });

        it('should have an array of children reference', function(done){
            expect(map.childrenRef).to.be.instanceOf(Array);
            done();
        });

        it('should have comment attribute', function(done){
            expect(map.comment).to.exist;
            done();
        });

        it('should have expand attribute', function(done){
            expect(map.expand).to.exist;
            done();
        });

        it('should have map id', function(done){
            expect(map.id).to.exist;
            done();
        });

        it('should have map level greater than equal 0', function(done){
            expect(map.level).to.be.at.least(0);
            done();
        });

        it('should have levelChangedByUser attribute', function(done){
            expect(map.levelChangedByUser).to.exist;
            done();
        });

        it('should have a map title', function(done){
            expect(map.title).to.exist;
            done();
        });

        it('should have a map url', function(done){
            expect(map.url).to.exist;
            done();
        });
    });

    /*
        getMapSetting
    */
    describe('getMapSetting', function(){
        var MAP_TYPE = 2;
        var USER_ID = 'nephelepro@gmail.com';

        var setting;

        beforeEach(function(done){
          var args = {
            mapType: MAP_TYPE,
            token: TOKEN,
            userId: USER_ID
          };
          try {
            service.getDesMap(args).then(function(mapSetting){
              setting = mapSetting;
              done();
            });
          } catch(error){
            done(error);
          }
          done();
        });

      it('should be valid', function(done){
        assert.isDefined(setting);
        done();
      });

        it('should have a map setting as an array of 2 element', function(done){
            expect(setting).to.be.instanceOf(Array);
            expect(setting).to.have.length.equal(2);
            done();
        });

        it('should have map id attribute', function(done){
            expect(setting[0].id).to.exist;
            done();
        });

        it('should have first time attribute', function(done){
            expect(setting[0].firstTime).to.exist;
            done();
        });

        it('should have level expand attribute to be at least 0', function(done){
            expect(setting[0].levelExpand).to.be.at.least(0);
        });

        it('should have level zoom attribute to be at least 0', function(done){
            expect(setting[0].levelZoom).to.be.at.least(0);
        });

        it('should have map type equal with MAP_TYPE=2', function(done){
            expect(setting[0].mapType).to.equal(MAP_TYPE);
            done();
        });
        it('should have maxX and maxY to be at least 0', function(done){
            expect(setting[0].maxX).to.be.at.least(0);
            expect(setting[0].maxY).to.be.at.least(0);
        });
    });

    /*
        Update first time
    */
    describe('updateFirstTime', function(){
        var MAP_ID = '1407987032717' ;
        var updateResult;

        var args = {
            mapId: MAP_ID,
            token: TOKEN
        };

        beforeEach(function(done){
          try {
           service.ChangeToFirstTime(args).then(function(result){
             updateResult = result;
             done();
           })
          } catch(error){
            done(error);
          }
          done();
        });

        it('should return success or not', function(done){
            expect(updateResult.isSuccess).to.exist;
            done();
        });
    });

    /*
        saveMap
    */
    describe('saveMap', function(){
        var MAP_ID = '1408348532593';
        var saveResult;

        var args = {
            mapId: MAP_ID,
            token: TOKEN,
            isExpand:true,
            pageId: 'O8ODwoTDgsKbXMODwoLDgw==',
            x: 1450,
            y: 1903.2000000000003
        };

        beforeEach(function(done){
           service.saveMap(args).then(function(result){
               saveResult = result;
               done();
           })
        });

        it('should return success or not', function(done){
            expect(saveResult.isSuccess).to.exist;
            done();
        });
    });

    /*
        updateMapAndZoomLevel
    */
    describe('updateMapAndZoomLevel', function(){
        var MAP_ID = '1408348532593';
        var result;

        var args = {
            levelZoom: 7,
            mapId: MAP_ID,
            token: TOKEN,
            x: 535.2727272727273,
            y: 5.629163636363617
        };

        beforeEach(function(done){
           service.updateMapAndZoom(args).then(function(updateResult){
               result = updateResult;
               done();
           })
        });

        it('should return success or not', function(done){
            expect(result.isSuccess).to.exist;
            done();
        });
    });

    /*
        updatePage
    */
    describe('updatePage', function(){
        var MAP_ID = '1408348532593';
        var result;

        var args = {
            isExpand: true,
            mapId: MAP_ID,
            token: TOKEN,
            x: 420,
            y: 1184.6771
        };

        beforeEach(function(done){
           service.pushPages(args).then(function(updateResult){
               result = updateResult;
               done();
           })
        });

        it('should return success or not', function(done){
            expect(result.isSuccess).to.exist;
            done();
        });
    });

    /*
        getLocalProjects
    */
    describe('getLocalProjects', function(){
        var projects;

        beforeEach(function(done){
           service.getLocalProjects('none', 'none').then(function(result){
               projects = result;
               done();
           })
        });

        it('should return an array of projects', function(done){
            expect(projects).to.be.instanceOf(Array);
            done();
        });
    });

    /*
        saveFilter
    */
    describe('saveFilter', function(){
      var result;
      var filter = {
        deleted: false,
        description: '',
        filterType: 1,
        name: 'all condition',
        sessionType: '["script","automate","exploratory","regression"]',
        tester: '["David Bund","Tim Robins","John Smith"]',
        timeline: '{"dateStart": 1391233574000, "dateEnd":1407696371000,"category":0}',
        userId: USER_ID
      };
      beforeEach(function(done){
        try {
          service.saveFilter(filter).then(function(saveFilterResult){
            result = saveFilterResult;
            FILTER_ID_CACHED = saveFilterResult;
            done();
          })
        } catch (error){
          done(error);
        }
        done();
      });

      it('should return save filter result', function(done){
          expect(result).to.exist;
          done();
      });
    });

    /*
        getFilter
    */
    describe('getFilter', function(){
      var filter;

      beforeEach(function(done){
         service.getFilter(USER_ID).then(function(result){
             filter = result;
             done();
         })
        });

        it('should return filter as an array', function(done){
          expect(filter).to.exist;
          expect(filter).to.be.instanceOf(Array);
          done();
        });
    });

    /*
        deleteFilter
    */
    describe('deleteFilter', function(){
      var result;

      beforeEach(function(done){
         service.deleteFilter(FILTER_TOKEN, FILTER_ID_CACHED).then(function(deleteResult){
             result = deleteResult;
             done();
         })
        });

        it('should return filter as an array', function(done){
          expect(result).to.exist;
          done();
        });
    });

    /*
        evaluateToken
    */
    describe('evaluateToken', function(){
      var result;
      beforeEach(function(done){
       service.evaluateToken(FILTER_TOKEN).then(function(evaluateResult){
           result = evaluateResult;
           done();
       })
      });

      it('should return filter', function(done){
        expect(result).to.exist;
        done();
      });

      it('should have display name', function(done){
        expect(result.displayName).to.exist;
        done();
      });

      it('should have email', function(done){
        expect(result.email).to.exist;
        done();
      });

      it('should have mapInfos as an array', function(done){
        expect(result.mapInfos).to.be.instanceOf(Array);
        done();
      });

      it('should have user id', function(done){
        expect(result.userId).to.exist;
        done();
      });

      it('should have usr project settings as an array', function(done){
        expect(result.userProjectSettings).to.be.instanceOf(Array);
        done();
      });
    });

});
  if (window.mochaPhantomJS) { mochaPhantomJS.run(); } else { mocha.run(); }
}
