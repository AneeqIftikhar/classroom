

var CLIENT_ID = '104171984509-bk2s4ivpb9d32ncburf3qq1h2n4u1l7i.apps.googleusercontent.com';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/classroom/v1/rest"];
var SCOPES = "https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.coursework.me";
var gapiReadiness = false;
var app = angular.module("myApp", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl : "home.html"
    }).when("/courses", {
        templateUrl : "courses.html"
    }).when("/progress", {
        templateUrl : "progress.html"
    }).when("/payments", {
        templateUrl : "payments.html"
    }).when("/add_course", {
        templateUrl : "add_course.html"
    }).when("/help", {
        templateUrl : "help.html"
    }).when("/logout", {
        templateUrl : "logout.html"
    }).when("/login", {
        templateUrl : "login.html"
    }).when("/signup", {
        templateUrl : "signup.html"
    }).when("/forgotpassword", {
        templateUrl : "forgotpassword.html"
    }).when("/course/:id", {
        templateUrl : "course.html"
    }).when("/course/:courseId/assignment/:assignmentId", {
        templateUrl : "assignment.html"
    }).when("/calendar/:id", {
        templateUrl : "calendar.html"
    }).when("/whiteboard/:id", {
        templateUrl : "whiteboard.html"
    });
});



app.controller("myCtrl", function($scope, $http, $route, $routeParams, $location, $window, $sce) {
    

    $scope.setPath = function(path){
        $location.path(path);
    };

    $scope.isLoggedIn = getItem('login');

    if(!$scope.isLoggedIn){
        $scope.setPath('/login');
    }

    $scope.user = JSON.parse(getItem('user'));
    $scope.loaderFlag = false;

    $scope.profilePhoto = {
        male : 'img/male.png',
        female : 'img/female.png'
    };

    $scope.baseURL = "http://classroom.dev-rec.com/api/";

    $scope.loginForm = {
        REQUEST : 'LOGIN',
        email : '',
        password: '',
    };

    $scope.signupForm = {
        REQUEST : 'SIGNUP',
        name : '',
        email : '',
        password: '',
        gender: ''
    };

    $scope.forgotPasswordForm = {
        REQUEST : 'FORGOT_PASSWORD',
        email : ''
    };

    $scope.newClass = {
        name : '',
        description : '',
        whiteboard : '',
        teachers : [],
        students : [],
        teacher : 0,
        student : 0
    };

    $scope.resetNewClass = {
        name : '',
        description : '',
        whiteboard : '',
        teachers : [],
        students : [],
        teacher : 0,
        student : 0
    };

    $scope.newMCQ = {
        REQUEST : 'CREATE_QUESTION',
        class_id : '',
        question : '',
        option1 : '',
        option2 : '',
        option3 : '',
        option4 : '',
        answer : 0
    };

    $scope.resetMCQ = {
        REQUEST : 'CREATE_QUESTION',
        class_id : '',
        question : '',
        option1 : '',
        option2 : '',
        option3 : '',
        option4 : '',
        answer : 0
    };

    var date = new Date();
    var currentUTCTime = date.getTime() + date.getTimezoneOffset()*60;


    $scope.courses = [];
    $scope.assignments = new Array();
    $scope.questions = new Array();
    $scope.solvedQuestions = new Array();
    
    $scope.$on('$routeChangeSuccess', function() {
        consoleLog('test'); // <-- alert from the question
    });

    if($scope.user == null){
        $scope.user = new Object();
    }

    angular.element(document).ready(function(){
        //handleClientLoad();
        consoleLog('Document Ready Event Fired');
    });

    $scope.login = function (){
        consoleLog("Logging In");
        $scope.showLoader();
        $http({
            url: $scope.baseURL,
            method: 'POST',   
            data: 'REQUEST='+$scope.loginForm.REQUEST+'&email='+$scope.loginForm.email+'&password='+$scope.loginForm.password,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(function(response){
            consoleLog(response);
            if(response.status == 200){
                var result = response.data;
                if(result.status == 'success'){
                    $scope.isLoggedIn = true;
                    var myUser = new Object();
                    myUser = result.data[0];
                    setItem('user', JSON.stringify(myUser));
                    setItem('login', $scope.isLoggedIn);
                    $scope.user = myUser;
                    $scope.setPath('/');
                    $route.reload();
                }else{
                    $scope.showToast("Email or password incorrect. Please try again.");
                }
            }
            $scope.hideLoader();
        }, function(response){
            consoleLog(response);
            $scope.isLoggedIn = false;
            $scope.user = new Object();
            setItem('login', false);
            removeItem('user');
            $scope.hideLoader();
        }); 
    };

    $scope.signup = function (){
        consoleLog("Signing Up");
        $scope.showLoader();
        $http({
            url: $scope.baseURL,
            method: 'POST',   
            data: 'REQUEST='+$scope.signupForm.REQUEST+'&email='+$scope.signupForm.email+'&password='+$scope.signupForm.password+'&name='+$scope.signupForm.name+'&gender='+$scope.signupForm.gender,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(function(response){
            consoleLog(response);
            if(response.status == 200){
                var result = response.data;
                if(result.status == 'success'){
                    $scope.showToast(result.message);
                }else{
                    $scope.showToast(result.message);
                }
            }
            $scope.hideLoader();
        }, function(response){
            consoleLog(response);
            $scope.hideLoader();
        }); 
    };

    $scope.forgotPassword = function (){
        consoleLog("Forgto Password");
        $scope.showLoader();
        $http({
            url: $scope.baseURL,
            method: 'POST',   
            data: 'REQUEST='+$scope.forgotPasswordForm.REQUEST+'&email='+$scope.forgotPasswordForm.email,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(function(response){
            consoleLog(response);
            if(response.status == 200){
                var result = response.data;
                if(result.status == 'success'){
                    $scope.showToast(result.message);
                }else{
                    $scope.showToast(result.message);
                }
            }
            $scope.hideLoader();
        }, function(response){
            consoleLog(response);
            $scope.hideLoader();
        }); 
    };

    $scope.logout = function (){
        $scope.user = new Object();
        removeItem('login');
        removeItem('user');
        removeItem('session');
        $scope.isLoggedIn = false;
        $scope.setPath('/login');
    };

    $scope.listCourses = function(){
        $scope.showLoader();
        $http({
            url: $scope.baseURL,
            method: 'POST',   
            data: 'REQUEST=GET_CLASSES_BY_USER&id='+$scope.user.id+'&role='+$scope.user.role,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(function(response){
            consoleLog(response);
            if(response.status==200){
                if(response.data.status == 'success'){
                    $scope.coursesAsTeacher = new Array();
                    $scope.coursesAsStudent = new Array();
                    for(var i=0; i<response.data.data.length; i++){
                        var course = response.data.data[i];
                        if(course.state != 2 ){
                            if(course.teacher == $scope.user.id){
                                $scope.coursesAsTeacher.push(course);
                            }else{
                                $scope.coursesAsStudent.push(course);
                            }
                        }
                    }
                    consoleLog($scope.coursesAsTeacher);
                    consoleLog($scope.coursesAsStudent);
                }else if(response.data.status == 'success'){
                    $scope.showAlert('Alert!', "Looks like you have not been enrolled in any course. If you have paid for a course then you can contact us at our support on www.icoachu.us", null, null);
                }else{
                    $scope.showAlert('Alert!', response.data.message, null, null);
                }
                $scope.hideLoader();
            }
        }, function(response){
            consoleLog(response);
            $scope.hideLoader();
        });    
    };

    $scope.plotCourse = function(){
        $scope.showLoader();
        $scope.isWhiteboard = false;
        $scope.addMCQs = false;
        $scope.addAssignment = false;
        $scope.addCourseStudent = false;
        var courseId = $routeParams.id;
        $http({
            url: $scope.baseURL,
            method: 'POST',   
            data: 'REQUEST=GET_CLASS_BY_ID&id='+courseId,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(function(response){
            consoleLog(response);
            $scope.hideLoader();
            if(response.status==200){
                if(response.data.status == 'success'){
                    $scope.course = response.data.data[0];
                    $scope.getCourseWork($scope.course.id);
                    $scope.plotMCQ($scope.course.id);

                    /*
                    if($scope.course.teacherFolder){
                        $scope.googelDriveLink = $scope.course.teacherFolder.alternateLink;
                    }else{
                        $scope.googelDriveLink = false;
                    }*/

                    if($scope.user.id == $scope.course.teacher){
                        $scope.iAmTeacher = true;
                        $scope.listCourseStudents($scope.course.student);
                    }else{
                        $scope.iAmTeacher = false;
                        $scope.listCourseTeachers($scope.course.teacher);
                    }
                     
                    if($scope.course.calendarId){          
                        $scope.courseCalendarId = ($scope.course.calendarId.split('@')[0]).split('classroom')[1]; 
                        consoleLog($scope.courseCalendarId);
                    }

                    if($scope.course.whiteboard){ 
                        $scope.isWhiteboard = true;
                        $scope.whiteboardId = $scope.course.whiteboard;
                    }
                }else{
                    $scope.showToast( response.data.message );
                }
            }
        }, function(response){
            consoleLog(response);
            $scope.showToast( "Error occurred." );
            $scope.hideLoader();
        });    
    };

    $scope.getCourseWork = function(courseId){
        $http({
            url: $scope.baseURL,
            method: 'POST',   
            data: 'REQUEST=GET_TOPICS&class_id='+courseId,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(function(response){
            consoleLog(response);
            $scope.isAssignment = false;
            if( response.status == 200 ){
                if(response.data.status == 'success'){
                    $scope.courseworks = response.data.data;
                    //$scope.getAllSubmissions(courseId);
                    var doneAssignments = 0;
                    var totalAssignments = 0;
                    for( var i = 0; i < $scope.courseworks.length; i++ ){
                        if($scope.courseworks[i].status != 2){
                            $scope.assignments.push($scope.courseworks[i]);
                            $scope.isAssignment = true;
                            totalAssignments++;
                            if($scope.courseworks[i].state == 4){
                                doneAssignments++;
                            }
                        }
                    }

                    if($scope.isAssignment){
                        $scope.courseProgress((doneAssignments/totalAssignments)*100);
                    }
                }else{
                    $scope.showToast(response.data.message);
                }
            }
        }, function(response){
            consoleLog(response);
        });    
    };

    $scope.listCourseStudents = function(id){
        $http({
            url: $scope.baseURL,
            method: 'POST',   
            data: 'REQUEST=GET_USER&id='+id,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(function(response){
            consoleLog(response);
            if(response.status==200){
                if(response.data.status == 'success'){
                    $scope.courseStudents = response.data.data[0];
                }else{
                    $scope.showAlert('ERROR!', response.data.message, null, null);
                }
            }
        }, function(response){
            consoleLog(response);
        }); 
    };

    $scope.listCourseTeachers = function(id){
        $http({
            url: $scope.baseURL,
            method: 'POST',   
            data: 'REQUEST=GET_USER&id='+id,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(function(response){
            consoleLog(response);
            if(response.status==200){
                if(response.data.status == 'success'){
                    $scope.courseTeachers = response.data.data[0];
                }else{
                    $scope.showAlert('ERROR!', response.data.message, null, null);
                }
            }
        }, function(response){
            consoleLog(response);
        }); 
    };

    $scope.getUsers = function(){
        $http({
            url: $scope.baseURL,
            method: 'POST',   
            data: 'REQUEST=GET_USERS',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(function(response){
            consoleLog(response);
            if(response.status==200){
                if(response.data.status == 'success'){
                    for(var i=0; i<response.data.data.length; i++){
                        if(response.data.data[i].role == 'Teacher'){
                            $scope.newClass.teachers.push(response.data.data[i]);
                        }else if(response.data.data[i].role == 'Student'){
                            $scope.newClass.students.push(response.data.data[i]);
                        }
                    }
                    consoleLog($scope.newClass.teachers);
                    consoleLog($scope.newClass.students);
                }else{
                    $scope.showToast("Students and Teachers data not received. Refresh page.");
                }
            }
        }, function(response){
            consoleLog(response);
        }); 
    };

    $scope.createCourse = function(){
        $scope.showLoader();

        if($scope.newClass.whiteboard.indexOf('awwapp.com') == -1){
            $scope.showToast('Whiteboard URL is INVALID');
        }else{
            $http({
                url: $scope.baseURL,
                method: 'POST',   
                data: 'REQUEST=CREATE_CLASS&name='+$scope.newClass.name+'&description='+$scope.newClass.description+'&whiteboard='+$scope.newClass.whiteboard+'&teacher='+$scope.newClass.teacher+'&student='+$scope.newClass.student,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function(response){
                consoleLog(response);
                if(response.status==200){
                    if(response.data.status == 'success'){
                        $scope.showToast('Classroom has been created successfully');
                        $scope.newClass = $scope.resetNewClass;
                    }
                }
                $scope.hideLoader();
            }, function(response){
                consoleLog(response);
                $scope.showToast('Something went wrong try again.');
                $scope.hideLoader();
            }); 
        }
    };

    $scope.setClassStatus = function(id, status){
        $scope.hideLoader();
        $http({
            url: 'https://classroom.googleapis.com/v1/courses/'+id+'?updateMask=courseState&access_token='+$scope.session.access_token,
            method: 'PATCH',   
            data:{
                "courseState": status
            }
        }).then(function(response){
            consoleLog(response);
            if(response.status==200){
                $scope.hideLoader();
                $scope.showToast('Course has been activated');
            }
        }, function(response){
            consoleLog(response);
            $scope.hideLoader();
        }); 
    };

    $scope.inviteUser = function(courseId, role){
        $scope.showLoader();
        var data =  {
            "courseId": courseId,
            "userId": document.getElementById('add_student').value,
            "role": role
        };
        consoleLog(data);
        $http({
            url: 'https://classroom.googleapis.com/v1/invitations?access_token='+$scope.session.access_token,
            method: 'POST',   
            data:data
        }).then(function(response){
            consoleLog(response);
            if(response.status==200){
                $scope.hideLoader();
                document.getElementById('add_student').value = '';
                $scope.showToast('Invitation has been sent.');
            }
        }, function(response){
            consoleLog(response);
            $scope.hideLoader();
            $scope.showToast(response.data.error.message);
        }); 
    };

    $scope.listInvitations = function(){
        $http({
            url: 'https://classroom.googleapis.com/v1/invitations?userId='+$scope.user.email+'&access_token='+$scope.session.access_token,
            method: 'GET'
        }).then(function(response){
            consoleLog(response);
            if(response.status==200){
                $scope.invitations = response.data.invitations;
            }
        }, function(response){
            consoleLog(response);
        }); 
    };

    $scope.acceptInvitation = function(invitation){
        consoleLog(invitation);
        $http({
            url: 'https://classroom.googleapis.com/v1/invitations/'+invitation.id+':accept?access_token='+$scope.session.access_token,
            method: 'POST'
        }).then(function(response){
            consoleLog(response);
            if(response.status==200){
                $scope.showToast('Invitation accepted successfully.');
            }
        }, function(response){
            consoleLog(response);
        }); 
    };

    $scope.getAllSubmissions = function(courseId){
        $http( {url : 'https://classroom.googleapis.com/v1/courses/'+courseId+'/courseWork/-/studentSubmissions?access_token='+ $scope.session.access_token , method: 'GET'}
        ).then(function(response){
            consoleLog('submissions');
            consoleLog(response);
            if(response.status==200){
                if($scope.courseworks &&JSON.stringify(response.data) != '{}'){
                    var doneAssignments = 0;
                    var totalAssignments = 0;
                    for( var i = 0; i < $scope.courseworks.length; i++ ){
                        $scope.courseworks[i].submission =  response.data.studentSubmissions[i];
                        if($scope.courseworks[i].workType == 'MULTIPLE_CHOICE_QUESTION'){
                            $scope.questions.push($scope.courseworks[i]);
                            $scope.isQuestion = true;
                        }else if($scope.courseworks[i].workType == 'ASSIGNMENT'){
                            $scope.assignments.push($scope.courseworks[i]);
                            $scope.isAssignment = true;
                            totalAssignments++;
                            if($scope.courseworks[i].submission.state == 'RETURNED'){
                                doneAssignments++;
                            }
                        }else {

                        }
                    }

                    if($scope.isAssignment){
                        $scope.courseProgress((doneAssignments/totalAssignments)*100);
                    }
                }
                consoleLog($scope.courseworks);
            }
        }, function(response){
            consoleLog(response);
        });
    };

    $scope.plotAssignment = function(){
        var courseId = $routeParams.courseId;
        var assignmentId = $routeParams.assignmentId;
        consoleLog(courseId);
        consoleLog(assignmentId);
        $http( {url : 'https://classroom.googleapis.com/v1/courses/'+courseId+'/courseWork/'+assignmentId+'?access_token='+ $scope.session.access_token , method: 'GET'}
        ).then(function(response){
            consoleLog(response);
            if(response.status==200){
                //$scope.getSubmissions(courseId, assignmentId);
            }
        }, function(response){
            consoleLog(response);
        });  
    };

    $scope.updateAssignment = function(id, status, count){
        for(var i=0; i<$scope.assignments.length; i++){
            if($scope.assignments[i].id==id){
                $scope.assignments[i].status = status;
                if(count>0){
                    $scope.assignments[i].count = count;
                }
                break;
            }
        }
    };

    $scope.submitAssignment = function(id){
        $scope.showLoader();
        $http({
            url: $scope.baseURL,
            method: 'POST',   
            data: 'REQUEST=UPDATE_TOPIC&id='+id+'&status=3',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(function(response){
            consoleLog(response);
            if(response.status==200){
                if(response.data.status == 'success'){
                    $scope.showToast(response.data.message);
                    $scope.updateAssignment(id, 3, 0);
                }else{
                    $scope.showAlert('ERROR!', response.data.message, null, null);
                }
            }
            $scope.hideLoader();
        }, function(response){
            consoleLog(response);
            $scope.hideLoader();
        });
    };

    $scope.reclaimAssignment = function(id){
        $scope.showLoader();
        $http({
            url: $scope.baseURL,
            method: 'POST',   
            data: 'REQUEST=RETAKE_TOPIC&id='+id,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(function(response){
            consoleLog(response);
            if(response.status==200){
                if(response.data.status == 'success'){
                    $scope.showToast(response.data.message);
                    $scope.updateAssignment(id, 1, 1);
                }else{
                    $scope.showAlert('ERROR!', response.data.message, null, null);
                }
            }
            $scope.hideLoader();
        }, function(response){
            consoleLog(response);
            $scope.hideLoader();
        });
    };

    $scope.returnAssignment = function(id){
        $scope.showLoader();
        $http({
            url: $scope.baseURL,
            method: 'POST',   
            data: 'REQUEST=UPDATE_TOPIC&id='+id+'&status=4',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(function(response){
            consoleLog(response);
            if(response.status==200){
                if(response.data.status == 'success'){
                    $scope.showToast(response.data.message);
                    $scope.updateAssignment(id, 4, 0);
                }else{
                    $scope.showAlert('ERROR!', response.data.message, null, null);
                }
            }
            $scope.hideLoader();
        }, function(response){
            consoleLog(response);
            $scope.hideLoader();
        });
    };

    $scope.deleteAssignment = function(assignment){
        $scope.showLoader();
        $http({
            url: $scope.baseURL,
            method: 'POST',   
            data: 'REQUEST=DELETE_TOPIC&id='+assignment.id,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(function(response){
            consoleLog(response);
            if(response.status==200){
                if(response.data.status == 'success'){
                    $scope.showToast(response.data.message);
                    var index = $scope.assignments.indexOf(assignment);
                    $scope.assignments.splice(index, 1);
                }else{
                    $scope.showToast(response.data.message);
                }
            }
            $scope.hideLoader();
        }, function(response){
            consoleLog(response);
            $scope.hideLoader();
        });
    };

    $scope.patchMCQ = function(courseId, courseWorkId, submissionId, selection){
        $scope.showLoader();
        var answer = document.querySelector('input[name="options_'+selection+'"]:checked').value;
        consoleLog(answer);
        $http({
            url : 'https://classroom.googleapis.com/v1/courses/'+courseId+'/courseWork/'+courseWorkId+'/studentSubmissions/'+submissionId+'?updateMask=draftGrade,assignedGrade&access_token='+$scope.session.access_token, 
            method: 'PATCH',
            data: {
              "assignedGrade": 0,
              "draftGrade": 0,
              "multipleChoiceSubmission": {
                "answer": answer
              }
            }

        }).then(function(response){
            consoleLog(response);
            if(response.status==200){
                $scope.showToast("successfully marked as done.");
            }
        }, function(response){
            consoleLog(response);
            $scope.hideLoader();
        });
    };

    $scope.answerMCQ = function(course_id, question){
        $http({
            url: $scope.baseURL,
            method: 'POST',   
            data: "REQUEST=ANSWER_QUESTION&id="+question.id+"&response="+question.response,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(function(response){
            consoleLog(response);
            if(response.status==200){
                if(response.data.status == 'success'){
                    var index = $scope.questions.indexOf(question);
                    $scope.questions.splice(index, 1);
                    question.status = 3;
                    $scope.solvedQuestions.push(question);
                    isSolvedQuestions = true;
                    $scope.showToast("Your response has been submitted.");
                    if(question.response == question.answer){
                        $scope.quizScore++;
                    }
                }else{
                    $scope.showToast(response.data.message);
                }
            }
            $scope.hideLoader();
        }, function(response){
            consoleLog(response);
            $scope.hideLoader();
        });
    };

    $scope.courseProgress = function(percent){
        consoleLog(percent);
        document.querySelector('.progressbar').style.width = percent + '%';
        document.querySelector('.bufferbar').style.width =  '0%';
        document.querySelector('.auxbar').style.width =  '100%';
    }

    $scope.createAssignment = function(class_id){
        $scope.showLoader();
        var title = document.getElementById("add_assignment_title").value;
        var description = document.getElementById("add_assignment_description").value;
        //var month = document.getElementById("add_assignment_due").value;
        //consoleLog(month);
        $http({
            url: $scope.baseURL,
            method: 'POST',   
            data: "REQUEST=CREATE_TOPIC&class_id="+class_id+"&name="+title+"&description="+description,   
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(function(response){
            consoleLog(response);
            if(response.status==200){
                document.getElementById("add_assignment_title").value = '';
                document.getElementById("add_assignment_description").value = '';
                $scope.showToast('Assignment created successfully.');
                var assignment = {
                    id : response.data.data.id,
                    name: title,
                    description: description,
                    status : 1,
                    ratings : -1,
                    count : 0
                }
                $scope.assignments.push(assignment);
            }
            $scope.hideLoader();
        }, function(response){
            consoleLog(response);
            $scope.hideLoader();
        });
    };

    $scope.createMCQ = function(courseId){
        $scope.showLoader();
        $scope.newMCQ.class_id = courseId;
        $http({
            url: $scope.baseURL,
            method: 'POST',   
            data: "REQUEST="+$scope.newMCQ.REQUEST+"&class_id="+$scope.newMCQ.class_id+"&question="+$scope.newMCQ.question+"&option4="+$scope.newMCQ.option4+"&option3="+$scope.newMCQ.option3+"&option2="+$scope.newMCQ.option2+"&option1="+$scope.newMCQ.option1+"&answer="+$scope.newMCQ.answer,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(function(response){
            consoleLog(response);
            if(response.status==200){
                if(response.data.status == 'success'){
                    $scope.showToast(response.data.message);
                    $scope.newMCQ = $scope.resetMCQ;
                    $scope.plotMCQ(courseId);
                }else{
                    $scope.showToast(response.data.message);
                }
            }
            $scope.hideLoader();
        }, function(response){
            consoleLog(response);
            $scope.hideLoader();
        });
    };

    $scope.deleteMCQ = function(courseId, question){
        $scope.showLoader();
        $scope.newMCQ.class_id = courseId;
        $http({
            url: $scope.baseURL,
            method: 'POST',   
            data: "REQUEST=DELETE_QUESTION&id="+question.id,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(function(response){
            consoleLog(response);
            if(response.status==200){
                if(response.data.status == 'success'){
                    $scope.showToast(response.data.message);
                    var index = $scope.questions.indexOf(question);
                    $scope.questions.splice(index, 1);
                }else{
                    $scope.showToast(response.data.message);
                }
            }
            $scope.hideLoader();
        }, function(response){
            consoleLog(response);
            $scope.hideLoader();
        });
    };

    $scope.deleteSolvedMCQ = function(courseId, question){
        $scope.showLoader();
        $scope.newMCQ.class_id = courseId;
        $http({
            url: $scope.baseURL,
            method: 'POST',   
            data: "REQUEST=DELETE_QUESTION&id="+question.id,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(function(response){
            consoleLog(response);
            if(response.status==200){
                if(response.data.status == 'success'){
                    $scope.showToast(response.data.message);
                    if(question.response == question.answer){
                        $scope.quizScore--;
                    }
                    var index = $scope.solvedQuestions.indexOf(question);
                    $scope.solvedQuestions.splice(index, 1);
                }else{
                    $scope.showToast(response.data.message);
                }
            }
            $scope.hideLoader();
        }, function(response){
            consoleLog(response);
            $scope.hideLoader();
        });
    };

    $scope.plotMCQ = function(class_id){
        $scope.isQuestion = false;
        $http({
            url: $scope.baseURL,
            method: 'POST',   
            data: "REQUEST=GET_QUESTIONS&class_id="+class_id,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(function(response){
            consoleLog(response);
            if(response.status==200){
                if(response.data.status == 'success'){
                    $scope.questions = new Array();
                    $scope.solvedQuestions = new Array();
                    $scope.quizScore = 0;
                    for(var i=0; i<response.data.data.length; i++){
                        if(response.data.data[i].status == 1){
                            $scope.questions.push(response.data.data[i]);
                            $scope.isQuestion = true;
                        }else if(response.data.data[i].status == 3){
                            if(response.data.data[i].response == response.data.data[i].answer){
                                $scope.quizScore++;
                            }
                            $scope.solvedQuestions.push(response.data.data[i]);
                            $scope.isSolvedQuestions = true;
                        }
                         
                    }
                    
                }else{
                    $scope.showToast(response.data.message);
                }
            }
            $scope.hideLoader();
        }, function(response){
            consoleLog(response);
            $scope.hideLoader();
        });
    };

    $scope.plotCalendar = function(){
        var calendarId = $routeParams.id;
        consoleLog(calendarId); 
        $scope.calendarLink = $sce.trustAsResourceUrl("https://calendar.google.com/calendar/embed?showTitle=0&amp;showNav=0&amp;showDate=0&amp;showPrint=0&amp;showTabs=0&amp;showCalendars=0&amp;showTz=0&amp;mode=WEEK&amp;height=600&amp;wkst=2&amp;bgcolor=%23ffffff&amp;src=classroom"+calendarId+"%40group.calendar.google.com&amp;color=%23a52714&amp;ctz=Etc%2FGMT");  
        consoleLog($scope.calendarLink); 
    };

    $scope.plotWhiteboard = function(){
        var whiteboardId = $routeParams.id;
        consoleLog(whiteboardId); 
        $scope.whiteboardLink = $sce.trustAsResourceUrl('https://awwapp.com/b/'+whiteboardId+'/');  
        consoleLog($scope.whiteboardLink); 

        /*var aww = new AwwBoard('#aww-wrapper', {
            apiKey: '2a17a37e-6fe1-45de-a518-9fa210d6f95d',
            autoJoin: true,
            boardLink: ''+whiteboardId,
            sizes: [3, 5, 8, 13, 20],
            fontSizes: [10, 12, 16, 22, 30],
            menuOrder: ['colors', 'sizes', 'tools', 'admin',
              'utils'],
            tools: ['pencil', 'eraser', 'text', 'image'],
            colors: [ "#000000", "#f44336", "#4caf50", "#2196f3",
              "#ffc107", "#9c27b0",     "#e91e63", "#795548"],
            defaultColor: "#000000",
            defaultSize: 8,
            defaultTool: 'pencil',
        });*/  
    };

    $scope.sendMail = function(emailId){
        var mail = 'https://mail.google.com/mail/?view=cm&fs=1&to='+ emailId +'&su=Student: Message Title Here.&body=Type Your Message Here.';
        $window.open(mail);
        consoleLog("Sending Mail");
    };

    $scope.openGoogleDrive = function(){
        var driveLink = $scope.course.teacherFolder.alternateLink;
        //$window.open(driveLink, '_blank');
        consoleLog("Opening Google Drive");
    };

    $scope.showToast = function(message){
        'use strict';
        var snackbarContainer = document.querySelector('#toast');
        var data = {
          message: message,
          timeout: 2000,
          actionHandler: null,
          actionText: ''
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    };

    $scope.showLoader = function(){
        consoleLog("displaying Loader");
        document.getElementById('loader').style.display = 'inherit';
    };

    $scope.hideLoader = function(){
        consoleLog("hiding Loader");
        document.getElementById('loader').style.display  = 'none';
    };

    $scope.showAlert = function(title, body, action, actionText){
        consoleLog("displaying Alert");
        document.getElementById('alert-title').innerHTML = title;
        document.getElementById('alert-body').innerHTML = body;
        var actionHTML = '<button class="mdl-button mdl-button--raised mdl-js-button mdl-js-ripple-effect mdl-button--accent" onclick="hideAlert()"> Close </button>';
        if(action){
            actionHTML += '<button class="mdl-button mdl-button--raised mdl-js-button mdl-js-ripple-effect mdl-button--accent" onclick="'+action+'()"> '+actionText+' </button>';
        }
        document.getElementById('alert-action').innerHTML = actionHTML;
        document.getElementById('popup').style.display = 'inherit';
    };

});

function hideAlert(){
    consoleLog("hiding Alert");
    document.getElementById('popup').style.display  = 'none';
}