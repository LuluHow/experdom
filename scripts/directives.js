// JavaScript source code

window.angular.module('app', [])

.directive('myInput', function ($compile) {
    var linkFn, _setInputDataId;
    _setInputDataId = function (id) {
        return '<div class="post reply-input" style="border: 1px solid black; width:1004px;"> \
                    <input type="text" ng-model="message" placeholder="type your message here..." style="width:1000px; height:100px"/> \
                    <button ng-click="sendResponse('+ id + ', message)" class="sender">post</button> \
                    <div class="fileUpload"> \
                        <span><i class="fa fa-paperclip"></i></span> \
                        <input type="file" class="upload" name="pending_attachment" /> \
                    </div> \
                 </div>';
    };
    linkFn = function (scope, element, attrs) {
        console.log(element);
        var button, post;
        post = angular.element(element[0])[0];
        button = angular.element(element[0].childNodes[3].childNodes[4].childNodes[10])[0];
        
        button.onclick = function () {
            var otherInputs = document.getElementsByClassName('reply-input');
            while (otherInputs[0]) {
                otherInputs[0].parentNode.removeChild(otherInputs[0]);
            }
            var el = $compile(_setInputDataId(attrs.id))(scope);
            post.appendChild(el[0]);
        };
    };
    return {
        restrict: 'E',
        link: linkFn
    };
});