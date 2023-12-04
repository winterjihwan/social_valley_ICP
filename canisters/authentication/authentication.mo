//0. LIBRARIES 
import H "mo:base/HashMap";
import Text "mo:base/Text";
import P "mo:base/Principal";
import Principal "mo:base/Principal";
import Int "mo:base/Int";
import Bool "mo:base/Bool";
import purify "canister:purify";

// exception
actor Authentication {
    // 타입 정의
    type AuthStatus = {
        principal: Text;
        var secretProvided: Bool;
        var secretHash: Text;
    };

    // MAPPING
    let authStatus = H.HashMap<Principal, AuthStatus>(0, P.equal, P.hash);

    public func status_initialize (_principal: Text) : async Bool {
        let principal = Principal.fromText(_principal);
        let status = switch (authStatus.get(principal)){
            case (null){
                let newStatus : AuthStatus = {
                    principal = _principal;
                    var secretProvided = false;
                    var secretHash = "";
                };
                authStatus.put(principal, newStatus);
                return false;
            };
            case (?s){
                return true;
            };
        };
    };  

    public func query_secretProvided (_principal: Text) : async Bool {
        let principal = Principal.fromText(_principal);
        let statusExists = await status_initialize(_principal);
        let status = switch (authStatus.get(principal)){
            case (null){
                return false;
            };
            case (?s){
                return s.secretProvided;
            };
        };
    };

    public func query_secretHash (_principal: Text) : async Text {
        let principal = Principal.fromText(_principal);
        let statusExists = await status_initialize(_principal);
        let status = switch (authStatus.get(principal)){
            case (null){
                return "";
            };
            case (?s){
                return s.secretHash;
            };
        };
    };

    public func update_secretProvided (_principal: Text, _secretProvided: Bool) : async Bool {
        let principal = Principal.fromText(_principal);
        let status = switch (authStatus.get(principal)){
            case (null){
                return false;
            };
            case (?s){
                s.secretProvided := _secretProvided;
                authStatus.put(principal, s);
                return true;
            };
        };
    };

    public func update_secretHash (_principal: Text, _secretHash: Text) : async Bool {
        let principal = Principal.fromText(_principal);
        let status = switch (authStatus.get(principal)){
            case (null){
                return false;
            };
            case (?s){
                s.secretHash := _secretHash;
                authStatus.put(principal, s);
                return true;
            };
        };
    };
};