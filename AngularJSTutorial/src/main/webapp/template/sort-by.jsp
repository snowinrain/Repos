<a ng-click="sort(sortvalue)" href="#">
  <span ng-transclude=""></span>
  <span ng-show="sortedby == sortvalue">
    <i ng-class="{true: 'icon-arrow-up', false: 'icon-arrow-down'}[sortdir == 'asc']"></i>
  </span>
</a>