define('app',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var App = exports.App = function () {
        function App() {
            _classCallCheck(this, App);
        }

        App.prototype.configureRouter = function configureRouter(config, router) {
            config.title = 'Leave tracker';

            config.map([{
                route: ['', 'home'],
                name: 'home',
                moduleId: './dash',
                nav: true,
                title: 'Home',
                settings: {
                    icon: 'time'
                }
            }, {
                route: 'reports',
                name: 'reports',
                moduleId: './reports',
                nav: true,
                title: 'Reports',
                settings: {
                    icon: 'list-alt'
                }
            }, {
                route: 'calendar',
                name: 'calendar',
                moduleId: './calendar',
                nav: true,
                title: 'Calendar',
                settings: {
                    icon: 'list-alt'
                }
            }, {
                route: 'add-request',
                name: 'add-request',
                moduleId: './add-request/add-request',
                nav: true,
                title: 'Add request',
                settings: {
                    icon: 'plus'
                }
            }]);

            this.router = router;
        };

        return App;
    }();
});
define('calendar',['exports', 'aurelia-framework', './services/leave-service'], function (exports, _aureliaFramework, _leaveService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Calendar = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Calendar = exports.Calendar = (_dec = (0, _aureliaFramework.inject)(_leaveService.LeaveService), _dec(_class = function () {
        function Calendar(leaveService) {
            _classCallCheck(this, Calendar);

            this.isLoading = true;
            this.calendar = {};

            this.leaveService = leaveService;
        }

        Calendar.prototype.attached = function attached() {
            var _this = this;

            this.leaveService.getApprovedLeaves().then(function (leaves) {
                _this.isLoading = false;
                _this.displayCalendar(leaves);
            });
        };

        Calendar.prototype.displayCalendar = function displayCalendar(events) {
            this.calendar = $('#calendar').calendar({
                tmpl_path: "bootstrap-calendar/tmpls/",
                events_source: events,
                modal_type: 'template',
                tmpl_cache: true,
                modal: '#events-modal',
                view: 'month',
                weekbox: false,
                views: {
                    day: {
                        enable: 0
                    }
                },
                merge_holidays: false,
                holidays: {},
                onAfterViewLoad: function onAfterViewLoad(view) {
                    $('.page-header h3').text(this.getTitle());
                    $('.btn-group button').removeClass('active');
                    $('button[data-calendar-view="' + view + '"]').addClass('active');
                }
            });
        };

        Calendar.prototype.switchViewTo = function switchViewTo(view) {
            this.calendar.view(view);
        };

        Calendar.prototype.navigateTo = function navigateTo(nav) {
            this.calendar.navigate(nav);
        };

        return Calendar;
    }()) || _class);
});
define('dash',['exports', 'aurelia-framework', './services/leave-service', './util/constants'], function (exports, _aureliaFramework, _leaveService, _constants) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Dash = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Dash = exports.Dash = (_dec = (0, _aureliaFramework.inject)(_leaveService.LeaveService), _dec(_class = function () {
        function Dash(leaveService) {
            _classCallCheck(this, Dash);

            this.leaveService = leaveService;
        }

        Dash.prototype.activate = function activate() {
            this.leaveRequests();
        };

        Dash.prototype.leaveRequests = function leaveRequests() {
            var _this = this;

            return this.leaveService.getLeaveRequests().then(function (result) {
                return _this.allRequests = result;
            });
        };

        Dash.prototype.computeBadge = function computeBadge(requestStatus) {
            switch (requestStatus) {
                case _constants.REQUEST_STATUS.APPROVED:
                    return 'list-group-item-success';
                case _constants.REQUEST_STATUS.REJECTED:
                    return 'list-group-item-danger';
                case _constants.REQUEST_STATUS.PENDING:
                    return 'list-group-item-info';
            }
        };

        Dash.prototype.showExtra = function showExtra(extra) {
            return extra.workDays > 1 ? true : false;
        };

        return Dash;
    }()) || _class);
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment', 'moment'], function (exports, _environment, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  var _moment2 = _interopRequireDefault(_moment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function configure(aurelia) {

    aurelia.use.standardConfiguration().plugin('aurelia-bootstrap', function (config) {
      return config.options.version = 4;
    }).plugin('aurelia-bootstrap-datetimepicker').plugin('aurelia-validation').plugin('aurelia-bootstrap-select').plugin('aurelia-dialog', function (config) {
      config.settings.lock = false;
      config.settings.enableEscClose = true;
    }).feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('reports',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Reports = exports.Reports = function Reports() {
    _classCallCheck(this, Reports);
  };
});
define('add-request/add-request',['exports', 'aurelia-framework', '../services/leave-service', 'moment', 'moment-business', '../util/constants'], function (exports, _aureliaFramework, _leaveService, _moment, _momentBusiness, _constants) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AddRequest = undefined;

    var _moment2 = _interopRequireDefault(_moment);

    var _momentBusiness2 = _interopRequireDefault(_momentBusiness);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2;

    var ANNUAL = _constants.LEAVE_TYPES.ANNUAL,
        SICK = _constants.LEAVE_TYPES.SICK,
        PARENTING = _constants.LEAVE_TYPES.PARENTING,
        UNPAID = _constants.LEAVE_TYPES.UNPAID,
        STUDY = _constants.LEAVE_TYPES.STUDY,
        HALF_DAY = _constants.LEAVE_TYPES.HALF_DAY;
    var AddRequest = exports.AddRequest = (_dec = (0, _aureliaFramework.inject)(_leaveService.LeaveService), _dec(_class = (_class2 = function () {
        function AddRequest(leaveService) {
            _classCallCheck(this, AddRequest);

            _initDefineProp(this, 'sPick', _descriptor, this);

            _initDefineProp(this, 'ePick', _descriptor2, this);

            this.dateFormat = 'YYYY-MM-DD';
            this.allowedDate = (0, _moment2.default)().subtract(1, "days").toDate();
            this.start = (0, _moment2.default)().toDate();
            this.end = (0, _moment2.default)().toDate();
            this.pickerOptions = {
                calendarWeeks: true,
                showTodayButton: true,
                showClose: true,
                daysOfWeekDisabled: [0, 6],
                format: this.dateFormat,
                minDate: this.allowedDate,
                widgetPositioning: {
                    horizontal: 'left'
                }
            };
            this.selectedLeave = {};
            this.leaveTypes = [{ value: ANNUAL, option: _constants.HUMAN_LEAVE_TYPES[ANNUAL] }, { value: SICK, option: _constants.HUMAN_LEAVE_TYPES[SICK] }, { value: PARENTING, option: _constants.HUMAN_LEAVE_TYPES[PARENTING] }, { value: STUDY, option: _constants.HUMAN_LEAVE_TYPES[STUDY] }, { value: UNPAID, option: _constants.HUMAN_LEAVE_TYPES[UNPAID] }, { value: HALF_DAY, option: _constants.HUMAN_LEAVE_TYPES[HALF_DAY] }];

            this.leaveService = leaveService;
        }

        AddRequest.prototype.sPickChanged = function sPickChanged() {
            var _this = this;

            this.sPick.events.onChange = function (e) {
                _this.ePick.methods.minDate(e.date);
                _this.start = e.date.toDate();
                _this.computeDiff();
            };

            this.sPick.events.onHide = function (e) {
                _this.ePick.methods.show();
            };
        };

        AddRequest.prototype.ePickChanged = function ePickChanged() {
            var _this2 = this;

            var that = this;
            this.ePick.events.onChange = function (e) {
                _this2.end = e.date.toDate();
                _this2.computeDiff();
            };
        };

        AddRequest.prototype.attached = function attached() {};

        AddRequest.prototype.computeDiff = function computeDiff() {
            var fr = (0, _moment2.default)(this.start);
            var to = (0, _moment2.default)(this.end);

            this.dateDiff = _momentBusiness2.default.weekDays(fr, to) + 1;

            console.log('from', fr);
            console.log('to', to);
        };

        AddRequest.prototype.submit = function submit() {
            if (this.canSave) {
                console.log('adding', this.start, this.end, this.dateDiff);
                this.leaveService.addLeaveRequest({
                    leaveType: this.selectedLeave[0],
                    start: this.start,
                    end: this.end,
                    workDays: this.dateDiff
                });

                this.start = (0, _moment2.default)().toDate();
                this.end = (0, _moment2.default)().toDate();
                this.dateDiff = 0;
            }
        };

        _createClass(AddRequest, [{
            key: 'canSave',
            get: function get() {
                return this.start && this.end && this.dateDiff >= 1;
            }
        }]);

        return AddRequest;
    }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'sPick', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'ePick', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    })), _class2)) || _class);
});
define('api/api',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Api = exports.Api = function Api() {
    _classCallCheck(this, Api);
  };
});
define('login/auth-service',['exports', 'aurelia-oauth', 'aurelia-framework'], function (exports, _aureliaOauth, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AuthService = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var _dec, _class;

    var AuthService = exports.AuthService = (_dec = (0, _aureliaFramework.inject)(_aureliaOauth.OAuthService), _dec(_class = function () {
        function AuthService(auth) {
            _classCallCheck(this, AuthService);

            this.auth = auth;
        }

        AuthService.prototype.login = function login() {
            return this.auth.login();
        };

        _createClass(AuthService, [{
            key: 'isLogged',
            get: function get() {
                return this.auth.isAuthenticated();
            }
        }]);

        return AuthService;
    }()) || _class);
});
define('models/user-model',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var UserModel = exports.UserModel = function () {
        function UserModel(data) {
            _classCallCheck(this, UserModel);

            Object.assign(this, data);
        }

        UserModel.prototype.hello = function hello() {
            return this.name + ' | ' + this.id;
        };

        return UserModel;
    }();
});
define('navs/top-nav',['exports', 'aurelia-framework', 'aurelia-dialog', '../services/user-service', '../profile/profile'], function (exports, _aureliaFramework, _aureliaDialog, _userService, _profile) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.TopNav = undefined;

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _dec, _class, _desc, _value, _class2, _descriptor;

    var TopNav = exports.TopNav = (_dec = (0, _aureliaFramework.inject)(_userService.UserService, _aureliaDialog.DialogService), _dec(_class = (_class2 = function () {
        function TopNav(userService, dialogService) {
            var _this = this;

            _classCallCheck(this, TopNav);

            _initDefineProp(this, 'router', _descriptor, this);

            this.user = {};
            this.userService = userService;
            this.dialogService = dialogService;

            this.userService.getUser().then(function (user) {
                return _this.user = user;
            });

            this.auth = {
                isLogged: true
            };
        }

        TopNav.prototype.openProfile = function openProfile() {
            return this.dialogService.open({ viewModel: _profile.Profile, model: 'Good or Bad?' });
        };

        return TopNav;
    }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'router', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    })), _class2)) || _class);
});
define('profile/profile',['exports', 'aurelia-framework', '../services/user-service'], function (exports, _aureliaFramework, _userService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Profile = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Profile = exports.Profile = (_dec = (0, _aureliaFramework.inject)(_userService.UserService), _dec(_class = function Profile(userService) {
        var _this = this;

        _classCallCheck(this, Profile);

        this.user = {};
        this.userLoaded = false;
        this.userService = userService;

        this.userService.getUser().then(function (user) {
            _this.user = user;
            _this.userLoaded = true;
        });
    }) || _class);
});
define('resources/index',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.configure = configure;
    function configure(config) {
        config.globalResources('./value-converters/date-format', './value-converters/humanize-leave', './elements/spinner/spinner.html');
    }
});
define('services/leave-service',['exports', 'moment'], function (exports, _moment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.LeaveService = undefined;

    var _moment2 = _interopRequireDefault(_moment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var LeaveService = exports.LeaveService = function () {
        function LeaveService() {
            _classCallCheck(this, LeaveService);

            this.leaveRequests = [{
                workDays: 1,
                start: 'Wed Apr 12 2017 00:00:00 GMT+0300 (EEST)',
                end: 'Wed Apr 13 2017 00:00:00 GMT+0300 (EEST)',
                status: 'approved'
            }, {
                workDays: 2,
                start: 'Wed Apr 12 2017 00:00:00 GMT+0300 (EEST)',
                end: 'Wed Apr 14 2017 00:00:00 GMT+0300 (EEST)',
                status: 'rejected'
            }, {
                workDays: 3,
                start: 'Wed Apr 12 2017 00:00:00 GMT+0300 (EEST)',
                end: 'Wed Apr 15 2017 00:00:00 GMT+0300 (EEST)',
                status: 'pending'
            }];
            this.approvedLeaves = [{
                "id": 1,
                "title": "Jane",
                "url": "http://example.com",
                "class": "event-important",
                "start": (0, _moment2.default)().subtract(2, 'days').toDate().valueOf(),
                "end": (0, _moment2.default)().valueOf() }, {
                "id": 2,
                "title": "John",
                "url": "http://example.com",
                "class": "event-special",
                "start": (0, _moment2.default)().valueOf(),
                "end": (0, _moment2.default)().valueOf() }];
        }

        LeaveService.prototype.getLeaveRequests = function getLeaveRequests() {
            var _this = this;

            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve(_this.leaveRequests);
                }, 500);
            });
        };

        LeaveService.prototype.addLeaveRequest = function addLeaveRequest(request) {
            var _this2 = this;

            var start = request.start,
                end = request.end,
                workDays = request.workDays,
                leaveType = request.leaveType;

            console.log('saving', request);
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    _this2.leaveRequests.push({
                        leaveType: leaveType,
                        start: start,
                        end: end,
                        workDays: workDays,
                        status: 'pending'
                    });
                }, 500);
            });
        };

        LeaveService.prototype.getApprovedLeaves = function getApprovedLeaves() {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve(_this3.approvedLeaves);
                }, 1000);
            });
        };

        return LeaveService;
    }();
});
define('services/user-service',['exports', '../models/user-model'], function (exports, _userModel) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.UserService = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var UserService = exports.UserService = function () {
        function UserService() {
            _classCallCheck(this, UserService);

            this.user = {
                id: 'unu-doi-trei',
                name: 'my awesome name',
                place: 'romanica',
                email: 'my@awesome.list',
                avatar: 'http://babyinfoforyou.com/wp-content/uploads/2014/10/avatar-300x300.png',
                department: 'QA/DEV/Lead',
                project: 'Bamboo',
                totalDaysPerYear: 24,
                remaining: 10,
                taken: 14
            };
        }

        UserService.prototype.getUser = function getUser() {
            var _this = this;

            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve(new _userModel.UserModel(_this.user));
                }, 500);
            });
        };

        return UserService;
    }();
});
define('util/constants',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var REQUEST_STATUS = exports.REQUEST_STATUS = {
        APPROVED: 'approved',
        REJECTED: 'rejected',
        PENDING: 'pending'
    };

    var LEAVE_TYPES = exports.LEAVE_TYPES = {
        ANNUAL: 'annual-leave',
        SICK: 'sick-leave',
        PARENTING: 'parenting-leave',
        UNPAID: 'unpaid-leave',
        STUDY: 'study-leave',
        HALF_DAY: 'half-day-leave'
    };

    var HUMAN_LEAVE_TYPES = exports.HUMAN_LEAVE_TYPES = {
        'annual-leave': 'Annual Leave',
        'sick-leave': 'Sick Leave',
        'parenting-leave': 'Parenting Leave',
        'unpaid-leave': 'Unpaid Leave',
        'study-leave': 'Study Leave',
        'half-day-leave': 'Half Day Off'
    };
});
define('resources/value-converters/date-format',['exports', 'moment'], function (exports, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DateFormatValueConverter = undefined;

  var _moment2 = _interopRequireDefault(_moment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var DateFormatValueConverter = exports.DateFormatValueConverter = function () {
    function DateFormatValueConverter() {
      _classCallCheck(this, DateFormatValueConverter);
    }

    DateFormatValueConverter.prototype.toView = function toView(value) {
      return (0, _moment2.default)(value).format('M/D/YYYY');
    };

    return DateFormatValueConverter;
  }();
});
define('resources/value-converters/humanize-leave',['exports', '../../util/constants'], function (exports, _constants) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HumanizeLeaveValueConverter = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var HumanizeLeaveValueConverter = exports.HumanizeLeaveValueConverter = function () {
    function HumanizeLeaveValueConverter() {
      _classCallCheck(this, HumanizeLeaveValueConverter);
    }

    HumanizeLeaveValueConverter.prototype.toView = function toView(value) {
      return _constants.HUMAN_LEAVE_TYPES[value];
    };

    return HumanizeLeaveValueConverter;
  }();
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"bootstrap/css/bootstrap.css\"></require><require from=\"./style.css\"></require><require from=\"./dash\"></require><require from=\"./navs/top-nav\"></require><top-nav router.bind=\"router\"></top-nav><div class=\"container\"><div class=\"page-host\"><router-view></router-view></div></div></template>"; });
define('text!style.css', ['module'], function(module) { module.exports = "body {\n    padding-top: 70px;\n}\n\nai-dialog-overlay.active {\n  background-color: black;\n  opacity: .5;\n}\n"; });
define('text!calendar.html', ['module'], function(module) { module.exports = "<template><require from=\"bootstrap-calendar/css/calendar.css\"></require><spinner show.bind=\"isLoading\"></spinner><div show.bind=\"!isLoading\" class=\"col-md-12\"><h3><i class=\"glyphicon glyphicon-dashboard\"></i> Calendar</h3><hr><div class=\"page-header\"><div class=\"pull-right form-inline\"><div class=\"btn-group\"><button click.delegate=\"navigateTo('prev')\" class=\"btn btn-primary\" data-calendar-nav=\"prev\">&lt;&lt; Prev</button> <button click.delegate=\"navigateTo('today')\" class=\"btn\" data-calendar-nav=\"today\">Today</button> <button click.delegate=\"navigateTo('next')\" class=\"btn btn-primary\" data-calendar-nav=\"next\">Next &gt;&gt;</button></div><div class=\"btn-group\"><button click.delegate=\"switchViewTo('year')\" class=\"btn btn-warning\" data-calendar-view=\"year\">Year</button> <button click.delegate=\"switchViewTo('month')\" class=\"btn btn-warning active\" data-calendar-view=\"month\">Month</button> <button click.delegate=\"switchViewTo('week')\" class=\"btn btn-warning\" data-calendar-view=\"week\">Week</button></div></div><h3></h3><small></small></div><div id=\"calendar\"></div><div class=\"modal fade\" id=\"events-modal\" role=\"dialog\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button><h4 class=\"modal-title\">Modal Header</h4></div><div class=\"modal-body\"><p>Some text in the modal.</p></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button></div></div></div></div></div></template>"; });
define('text!resources/elements/spinner/spinner.css', ['module'], function(module) { module.exports = ".cssload-box-loading {\n    width: 47px;\n    height: 47px;\n    margin: auto;\n    position: absolute;\n    left: 0;\n    right: 0;\n    top: 0;\n    bottom: 0;\n}\n.cssload-box-loading:before {\n    content: '';\n    width: 47px;\n    height: 5px;\n    background: rgb(0,0,0);\n    opacity: 0.1;\n    position: absolute;\n    top: 56px;\n    left: 0;\n    border-radius: 50%;\n    animation: shadow 0.475s linear infinite;\n        -o-animation: shadow 0.475s linear infinite;\n        -ms-animation: shadow 0.475s linear infinite;\n        -webkit-animation: shadow 0.475s linear infinite;\n        -moz-animation: shadow 0.475s linear infinite;\n}\n.cssload-box-loading:after {\n    content: '';\n    width: 47px;\n    height: 47px;\n    background: rgb(26,54,104);\n    position: absolute;\n    top: 0;\n    left: 0;\n    border-radius: 3px;\n    animation: cssload-animate 0.475s linear infinite;\n        -o-animation: cssload-animate 0.475s linear infinite;\n        -ms-animation: cssload-animate 0.475s linear infinite;\n        -webkit-animation: cssload-animate 0.475s linear infinite;\n        -moz-animation: cssload-animate 0.475s linear infinite;\n}\n\n\n\n@keyframes cssload-animate {\n    17% {\n        border-bottom-right-radius: 3px;\n    }\n    25% {\n        transform: translateY(9px) rotate(22.5deg);\n    }\n    50% {\n        transform: translateY(17px) scale(1, 0.9) rotate(45deg);\n        border-bottom-right-radius: 38px;\n    }\n    75% {\n        transform: translateY(9px) rotate(67.5deg);\n    }\n    100% {\n        transform: translateY(0) rotate(90deg);\n    }\n}\n\n@-o-keyframes cssload-animate {\n    17% {\n        border-bottom-right-radius: 3px;\n    }\n    25% {\n        -o-transform: translateY(9px) rotate(22.5deg);\n    }\n    50% {\n        -o-transform: translateY(17px) scale(1, 0.9) rotate(45deg);\n        border-bottom-right-radius: 38px;\n    }\n    75% {\n        -o-transform: translateY(9px) rotate(67.5deg);\n    }\n    100% {\n        -o-transform: translateY(0) rotate(90deg);\n    }\n}\n\n@-ms-keyframes cssload-animate {\n    17% {\n        border-bottom-right-radius: 3px;\n    }\n    25% {\n        -ms-transform: translateY(9px) rotate(22.5deg);\n    }\n    50% {\n        -ms-transform: translateY(17px) scale(1, 0.9) rotate(45deg);\n        border-bottom-right-radius: 38px;\n    }\n    75% {\n        -ms-transform: translateY(9px) rotate(67.5deg);\n    }\n    100% {\n        -ms-transform: translateY(0) rotate(90deg);\n    }\n}\n\n@-webkit-keyframes cssload-animate {\n    17% {\n        border-bottom-right-radius: 3px;\n    }\n    25% {\n        -webkit-transform: translateY(9px) rotate(22.5deg);\n    }\n    50% {\n        -webkit-transform: translateY(17px) scale(1, 0.9) rotate(45deg);\n        border-bottom-right-radius: 38px;\n    }\n    75% {\n        -webkit-transform: translateY(9px) rotate(67.5deg);\n    }\n    100% {\n        -webkit-transform: translateY(0) rotate(90deg);\n    }\n}\n\n@-moz-keyframes cssload-animate {\n    17% {\n        border-bottom-right-radius: 3px;\n    }\n    25% {\n        -moz-transform: translateY(9px) rotate(22.5deg);\n    }\n    50% {\n        -moz-transform: translateY(17px) scale(1, 0.9) rotate(45deg);\n        border-bottom-right-radius: 38px;\n    }\n    75% {\n        -moz-transform: translateY(9px) rotate(67.5deg);\n    }\n    100% {\n        -moz-transform: translateY(0) rotate(90deg);\n    }\n}\n\n@keyframes shadow {\n    0%,\n    100% {\n        transform: scale(1, 1);\n    }\n    50% {\n        transform: scale(1.2, 1);\n    }\n}\n\n@-o-keyframes shadow {\n    0%,\n    100% {\n        -o-transform: scale(1, 1);\n    }\n    50% {\n        -o-transform: scale(1.2, 1);\n    }\n}\n\n@-ms-keyframes shadow {\n    0%,\n    100% {\n        -ms-transform: scale(1, 1);\n    }\n    50% {\n        -ms-transform: scale(1.2, 1);\n    }\n}\n\n@-webkit-keyframes shadow {\n    0%,\n    100% {\n        -webkit-transform: scale(1, 1);\n    }\n    50% {\n        -webkit-transform: scale(1.2, 1);\n    }\n}\n\n@-moz-keyframes shadow {\n    0%,\n    100% {\n        -moz-transform: scale(1, 1);\n    }\n    50% {\n        -moz-transform: scale(1.2, 1);\n    }\n}\n"; });
define('text!dash.html', ['module'], function(module) { module.exports = "<template><div class=\"col-md-12\"><h3><i class=\"glyphicon glyphicon-dashboard\"></i> Dashboard</h3><hr><div class=\"row\"><div class=\"col-md-6\"><div class=\"panel panel-default\"><div class=\"panel-heading\"><h4>Recent requests</h4></div><div class=\"panel-body\"><spinner></spinner><ul class=\"list-group\"><li repeat.for=\"request of allRequests\" class=\"list-group-item ${computeBadge(request.status)}\"><span>${request.workDays} ${request.workDays > 1 ? 'Days' : 'Day'} | </span>${request.start | dateFormat} <span show.bind=\"showExtra(request)\">- ${request.end | dateFormat} | ${request.leaveType | humanizeLeave} </span><span class=\"badge badge-pill\">${request.status}</span></li></ul></div></div></div><div class=\"col-md-6\"><div class=\"panel panel-default\"><div class=\"panel-heading\"><h4>Recent requests</h4></div><div class=\"panel-body\"><spinner></spinner><ul class=\"list-group\"><li repeat.for=\"request of allRequests\" class=\"list-group-item ${computeBadge(request.status)}\"><span>${request.workDays} ${request.workDays > 1 ? 'Days' : 'Day'} | </span>${request.start | dateFormat} - ${request.end | dateFormat} <span class=\"badge badge-pill\">${request.status}</span></li></ul></div></div></div></div></div></template>"; });
define('text!reports.html', ['module'], function(module) { module.exports = "<template><div class=\"col-sm-9\"><h3><i class=\"glyphicon glyphicon-list-alt\"></i> Reports could be built here :)</h3><hr></div></template>"; });
define('text!add-request/add-request.html', ['module'], function(module) { module.exports = "<template><require from=\"eonasdan-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css\"></require><require from=\"bootstrap-select/css/bootstrap-select.min.css\"></require><div class=\"col-sm-9\"><h3><i class=\"glyphicon glyphicon-plus\"></i> Add a new leave request here</h3><hr><form submit.delegate=\"submit()\"><div class=\"form-group\"><label class=\"control-label\">Leave type</label><abp-select selected-value.bind=\"selectedLeave\" collection.bind=\"leaveTypes\" object-key=\"value\"></abp-select></div><div class=\"form-group\"><label>Start date</label><abp-datetime-picker options.bind=\"pickerOptions\" element.bind=\"sPick\" model.bind=\"start\"></abp-datetime-picker></div><div class=\"form-group\"><label>End date</label><abp-datetime-picker options.bind=\"pickerOptions\" element.bind=\"ePick\" model.bind=\"end\"></abp-datetime-picker></div><div class=\"form-group\"><label class=\"control-label\">Number of days you want to take</label><input readonly=\"readonly\" type=\"number\" class=\"form-control\" placeholder=\"Choose a date\" value.bind=\"dateDiff\"></div><button class=\"btn btn-primary ${canSave ? '' : 'disabled'}\" type=\"submit\">Submit</button></form></div></template>"; });
define('text!navs/top-nav.html', ['module'], function(module) { module.exports = "<template><nav id=\"top-nav\" class=\"navbar navbar-inverse navbar-fixed-top\"><div class=\"container\"><div class=\"navbar-collapse collapse\"><ul class=\"nav navbar-nav navbar-left\"><li repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\"><a href.bind=\"row.href\"><i class=\"glyphicon glyphicon-${row.settings.icon}\"></i> ${row.title}</a></li><li show.bind=\"!auth.isLogged\" class=\"dropdown\"><a click.delegate=\"auth.login()\">Login</a></li></ul><ul class=\"nav navbar-nav navbar-right\"><li show.bind=\"auth.isLogged\" class=\"dropdown\"><a class=\"dropdown-toggle\" role=\"button\" data-toggle=\"dropdown\" href=\"#\"><i class=\"glyphicon glyphicon-user\"></i> ${user.name} <span class=\"caret\"></span></a><ul id=\"g-account-menu\" class=\"dropdown-menu\" role=\"menu\"><li><a click.delegate=\"openProfile()\">My Profile</a></li><li><a click.delegate=\"auth.logout()\"><i class=\"glyphicon glyphicon-off\"></i> Logout</a></li></ul></li><li show.bind=\"!auth.isLogged\" class=\"dropdown\"><a click.delegate=\"auth.login()\">Login</a></li></ul></div></div></nav></template>"; });
define('text!profile/profile.html', ['module'], function(module) { module.exports = "<template><spinner show.bind=\"!userLoaded\"></spinner><ai-dialog show.bind=\"userLoaded\"><ai-dialog-body><div class=\"panel panel-info\"><div class=\"panel-heading\"><h3 class=\"panel-title\">${user.name}</h3></div><div class=\"panel-body\"><div class=\"row\"><div class=\"col-md-3 col-lg-3\" align=\"center\"><img alt=\"User Pic\" src=\"${user.avatar}\" class=\"img-circle img-responsive\"></div><div class=\"col-md-5 col-lg-5\"><ul><li>Department: ${user.department}</li><li>Project: ${user.project}</li><li>Total days/year: ${user.totalDaysPerYear}</li><li>Remaining days: ${user.remaining}</li><li>Taken days: ${user.taken}</li></ul></div><div class=\"col-md-4 col-lg-4\"><ul><li>Department: ${user.department}</li><li>Project: ${user.project}</li><li>Total days/year: ${user.totalDaysPerYear}</li><li>Remaining days: ${user.remaining}</li><li>Taken days: ${user.taken}</li></ul></div></div></div></div></ai-dialog-body></ai-dialog></template>"; });
define('text!resources/elements/spinner/spinner.html', ['module'], function(module) { module.exports = "<template><require from=\"./spinner.css\"></require><div class=\"cssload-box-loading\"></div></template>"; });
//# sourceMappingURL=app-bundle.js.map