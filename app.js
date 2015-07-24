/**
 PACKAGE LIST

 # Meteor packages used by this project, one per line.
 #
 # 'meteor add' and 'meteor remove' will edit this file for you,
 # but you can also edit it by hand.

 meteor-platform
 iron:router
 sacha:spin
 accounts-password
 ian:bootstrap-3
 ian:accounts-ui-bootstrap-3
 dbarrett:dropzonejs
 aldeed:autoform
 aldeed:collection2
 aldeed:autoform-select2
 natestrauser:select2
 zimme:select2-bootstrap3-css
 ongoworks:security
 meteorhacks:fast-render
 multiply:iron-router-progress
 dburles:collection-helpers
 accounts-base
 alanning:roles
 fortawesome:fontawesome
 yogiben:admin
 fezvrasta:bootstrap-material-design
 aslagle:reactive-table
 anti:i18n
 email


 persons.php?id=144135
 persons.php?id=217322

 */


var Func = {
    getReqString: function(label,autoform) {
        return {
            label: label,
            type: String,
            optional: false,
            autoform: autoform || {}
        }
    },

    getAFSelect: function(options) {
        return {
            type: "select",
            options: function () {
                return options;
            }
        }
    },
    getOwner: function() {
        return {
            type: String,
            optional: false,
            regEx: SimpleSchema.RegEx.Id,
            autoValue: function () {
                if (this.isInsert) {
                    return Meteor.userId();
                }
            }
        }
    }
}

////// COLLECTIONS  /////////////

ScoringProject = new Meteor.Collection('scoringProject');

ScoringQuestion = new Meteor.Collection('scoringQuestion');

ScoringInstance = new Meteor.Collection('scoringInstance');


ScoringProjectStructureSchema = new SimpleSchema({

    type: Func.getReqString("Тип отображения",
          Func.getAFSelect([
                    {label: "Листинг", value: "listing"},
                    {label: "Автозагрузка", value: "listing"}
                ])
    ),


    questions: {
        label: "Вопросы для скоринга:",
        type: [Object],
        minCount: 1,
        maxCount: 5
    },

    'questions.$.questionId': {
        label: "Вопрос:",
        type: String,
        optional: true,
        autoform: {
            type: "select",
            placeholder: "Выбрать вопрос:",
            firstOption: true,
            options: function () {
                Meteor.subscribe('ScoringQuestion');
                var scoringQuestion = ScoringQuestion.find({});
                var arrLabels = [];
                scoringQuestion.forEach(function (obj) {
                    arrLabels.push({label: obj.title, value: obj._id});
                });
                return arrLabels;
            }
        }
    }

});

ScoringProjectSchema = new SimpleSchema({

    title: {
        type: String,
        label: "Название:",
        max: 200,
        optional: true,
        autoform: {
            afFieldInput: {
                placeholder:" Название"
            }
        }
    },
    type: {
        label: "Тип скоринга:",
        type: String,
        optional: true,
        autoform: {
            type: "select2",
            options: function () {
                return [
                    {label: "application", value: "application"},
                    {label: "behavioral", value: "behavioral"}
                ];
            }
        }
    },
    humanFrendlyUrl: {
        type: String,
        label: "Относительный адрес страницы скоринга:",
        max: 200,
        optional: true
    },
    structure: {
        label: "Структура вопросов:",
        type: ScoringProjectStructureSchema,
        optional: false
    },
    rangePointMessage: {
        label: "Комментарии для диапазона баллов",
        type: [Object]
    },
    'rangePointMessage.$.from': {
        label: "От",
        type: Number
    },
    'rangePointMessage.$.to': {
        label: "До",
        type: Number
    },
    'rangePointMessage.$.resultMessage': {
        label: "Комментарии для диапазона",
        type: String
    },
    owner: Func.getOwner()

});
ScoringProject.attachSchema(ScoringProjectSchema);

ScoringQuestionSchema = new SimpleSchema({

    title: {
        type: String,
        label: "Вопрос:",
        max: 200,
        optional: false
    },

    adminComment: {
        type: String,
        label: "Комментарий для администратора:",
        max: 200,
        optional: true
    },

    answers: {
        label: "Ответы:",
        type: [Object],
        optional: false,
        minCount: 1,
        maxCount: 5
    },

    'answers.$.text': {
        label: "Текст ответа:",
        optional: false,
        type: String
    },
    'answers.$.points': {
        type: Number,
        label: "Балл:",
        optional: false,
        autoform: {
            afFieldInput: {
                type: "number"
            }
        }
    },
    owner: Func.getOwner()

});

ScoringQuestion.attachSchema(ScoringQuestionSchema);

ScoringResultSchema = new SimpleSchema({

    results: {
        label: "Результат подсчета:",
        type: [Object],
        minCount: 1,
        maxCount: 5
    },

    'results.$.questionId': {
        label: "Вопрос:",
        type: String,
        optional: true,
        autoform: {
            type: "select",
            options: function () {
                Meteor.subscribe('ScoringQuestion');
                var scoringQuestion = ScoringQuestion.find({});
                var arrLabels = [];
                scoringQuestion.forEach(function (obj) {
                    arrLabels.push({label: obj.title, value: obj._id});
                });
                return arrLabels;
            }
        }
    },

    'results.$.answer': {
        label: "Ответы:",
        type: String,
        optional: true,
        autoform: {
            type: "select-radio",
            options: function () {
//            if (Meteor.isClient) {
//                 var docId = '';

//                 docId = AutoForm.getFormValues("admin_insert");
// console.log(docId);

//             }

                return [
                    {label: "Test", value: "test"},
                    {label: "Test 1", value: "test 1"}
                ];
            }
        }
    }
});


ScoringInstanceSchema = new SimpleSchema({

    title: {
        label: " ",
        type: String,
        max: 200,
        optional: true,
        autoform: {
            afFieldInput: {
                type: "hidden",
                value: "scoringInstance"
            }
        }
    },
    firstname: {
        type: String,
        label: "Имя:",
        max: 200,
        optional: false
    },
    lastname: {
        type: String,
        label: "Фамилия:",
        max: 200,
        optional: false
    },
    phone: {
        label: "Телефон:",
        type: String,
        optional: false,
        autoform: {
            afFieldInput: {
                type: "tel"
            }
        }
    },
    email: {
        type: String,
        label: "Email:",
        optional: false,
        autoform: {
            afFieldInput: {
                type: "email"
            }
        }
    },
    projectId: {
        type: String,
        label: "Проект Скоринга:",
        autoform: {
            optional: false,
            type: "select",
            options: function () {
                Meteor.subscribe('ScoringProject', {}, {});
                var scoringProjects = ScoringProject.find({});
                var arrLabels = [];
                scoringProjects.forEach(function (obj) {
                    arrLabels.push({label: obj.title, value: obj._id});
                });
                return arrLabels;
            }
        }
    },
    points: {
        type: Number,
        label: "Oбщий балл:",
        optional: true,
        autoform: {
            afFieldInput: {
                type: "number"
            }
        }
    },
    resultComment: {
        type: String,
        label: "Комментарий результата:",
        optional: true
    },
    /*answers: {
     label: "Результат подсчета:",
     type: ScoringResultSchema,
     },*/
    owner: Func.getOwner()

});

ScoringInstance.attachSchema(ScoringInstanceSchema);

AdminConfig = {
    name: 'Scoring',
    adminEmails: ['leshik-240505@rambler.ru'],
    dashboard: {
//         homeUrl: '/dashboard',
        skin: 'black'
    },
    collections: {
        ScoringProject: {
            icon: 'area-chart',
            color: 'red',
            omitFields: ['owner'],
            tableColumns: [
                {label: 'Название', name: 'title'},
                {label: 'Тип', name: 'type'}
            ]
        },
        ScoringQuestion: {
            icon: 'bar-chart',
            color: 'green',
            omitFields: ['owner'],
            tableColumns: [
                {label: 'Название', name: 'title'},
                {label: 'Комментарий', name: 'adminComment'}
            ]
        },
        ScoringInstance: {
            icon: 'bank',
            color: 'yellow',
            omitFields: ['owner'],
            tableColumns: [
                {label: 'Имя', name: 'firstname'},
                {label: 'Фамилия', name: 'lastname'}
            ]
        }
    }
};


if (Meteor.isServer) {

    ////// PERMISSIONS ///////////////////////
    Security.permit(['insert', 'update', 'remove']).collections(
        [ScoringProject, ScoringQuestion, ScoringInstance]
    ).apply();


    Meteor.publish("ScoringProject", function (find, options) {
        return ScoringProject.find(find, options);
    });

    Meteor.publish("ScoringQuestion", function (find, options) {
        return ScoringQuestion.find(find, options);
    });

    Meteor.publish("ScoringInstance", function () {
        return ScoringInstance.find();
    });









    Meteor.startup(function () {



//        smtp = {
//            username: '',
//            password: '',
//            server:   'smtp-relay.gmail.com',
//            port: 25
//        }
//
//        process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;

    });






}


if (Meteor.isClient) {

    Router.configure({
        layoutTemplate: 'layout',
        loadingTemplate: 'loading',
        waitOn: function () {
            return [
//                 Meteor.subscribe('NR'),
            ];
        },
        fastRender: true
    });

    Router.map(function () {
        this.route('Main', {
            path: '/'
//             disableProgress: true
        });
        this.route('resultMessage', {
            path: '/resultMessage/:project/:points',
//             disableProgress: true
            waitOn: function () {
                return Meteor.subscribe('ScoringProject', {}, {});
            },
            data: function () {
                var points = this.params.points;
                var project = this.params.project;

                var dataProject = ScoringProject.findOne(project);
                var resultMessage = 'Результат: ';

//               console.log(dataProject);

                if (dataProject.rangePointMessage !== 'undefined') {
                    dataProject.rangePointMessage.forEach(function (obj) {
                        if (points > obj.from && points < obj.to) {
                            resultMessage += obj.resultMessage;
                        }
                    });
                }

                return {
                    'resultMessage': resultMessage,
                    'project': project
                };
            }
        });
        this.route('scoringPass', {
            path: '/scoringPass/:humanFrendlyUrl',
            waitOn: function () {
                return Meteor.subscribe('ScoringProject', {}, {});
            },
            data: function () {
                return ScoringProject.findOne({'humanFrendlyUrl': this.params.humanFrendlyUrl});
            }
        });
        this.route('addScoringProject',{
            path: '/addScoringProject'
        });
        this.route('addScoringQuestion',{
            path: '/addScoringQuestion'
        });
        this.route('scoringQuestionList',{
            path: '/scoringQuestionList'
        });
        this.route('scoringProjectList',{
            path: '/scoringProjectList'
        })
    });

    Router.onBeforeAction('loading');

    Router.route('analytics', {
        path: AdminDashboard.path('analytics'),
        controller: 'AdminController',
        onAfterAction: function () {
            Session.set('admin_title', 'Analytics');
        }
    });

    Template.Main.helpers({
        scoringProjects: function () {
            Meteor.subscribe('ScoringProject', {}, {});
            return ScoringProject.find({});
        }
    });

    Template.scoringPassItem.helpers({
        scoringQuestion: function () {
            Meteor.subscribe('ScoringQuestion', {'_id': this.questionId}, {});
            return ScoringQuestion.findOne(this.questionId);
        }
    });

    Template.scoringQuestionList.helpers({
        ScoringQuestion: function () {
            Meteor.subscribe('ScoringQuestion', {}, {});
            return ScoringQuestion.find();
        },
        fields: [{key:"title",label:"Название"}]
    });

    Template.scoringProjectList.helpers({
        scoringProjects: function () {
            Meteor.subscribe('ScoringProject', {}, {});
            return ScoringProject.find();
        },
        fields: [{key:"title",label:"Название"}]
    });

    Template.scoringPass.events({
        'click #scoreResultButton': function (event) {
            var points = 0;
            $('label.active').find('input').map(function () {
                var dataId = $(this).attr('data-id');
                points = points + parseInt(dataId);
            });

            Router.go('resultMessage', {
                'project': this._id,
                'points': points
            });
        }
    });

    Template.scoringPassItem.helpers({
        resultMessage: function () {
//            Meteor.subscribe('ScoringQuestion',{'_id':this.questionId},{});
//            return ScoringQuestion.findOne(this.questionId);
            return points;
        }
    });

    Template.connectionTpl.helpers({
        status: function () {
            return Meteor.status().connected;
        }
    });

    Meteor.startup(function () {
//       NR.setDefaultTemplate("semanticUI");
    });

    i18n.setLanguage('ru');


}///// END CLIENT //////////////////////////










