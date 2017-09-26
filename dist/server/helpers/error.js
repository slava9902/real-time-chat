(function(error) {
  var AgentRestictedError = function(message) {
    this.message = message;
    this.name = 'AgentRestictedError';
    Error.captureStackTrace(this, AgentRestictedError);
  };

  AgentRestictedError.prototype = Object.create(Error.prototype);
  AgentRestictedError.prototype.constructor = AgentRestictedError;

  
  var AuthorizationError = function(message) {
    this.message = message;
    this.name = 'AuthorizationError';
    Error.captureStackTrace(this, AuthorizationError);
  };
  
  AuthorizationError.prototype = Object.create(Error.prototype);
  AuthorizationError.prototype.constructor = AuthorizationError;

 return error.exports = {
    'AgentRestictedError': AgentRestictedError,
    'AuthorizationError' : AuthorizationError
  };
})(module);
