//0. LIBRARIES 
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import H "mo:base/HashMap";
import Buffer "mo:base/Buffer";
import Text "mo:base/Text";
import P "mo:base/Principal";
import Principal "mo:base/Principal";
import Int "mo:base/Int";


actor Purify {
        // 타입 정의
        type Profile = {
          principal: Text;
          var plus: Int;
          var minus: Int;
          var vely_points: Int;
          var comments: Buffer.Buffer<Comment>;
        };

        type Index = {
          var next_id: Text;
          var post_address: Text;
          var post_groupId: Text;
          var friend_tech: Text;
          var stars_address: Text;
          var stars_twitter_handle: Text;
          var stars_groupId: Text;
        };

        type Comment = {
          comment: Text;
          commentor: Text;
        };

        // MAPPING
        let principalToProfile = H.HashMap<Principal, Profile>(0, P.equal, P.hash);
        let principalToIndex = H.HashMap<Principal, Index>(0, P.equal, P.hash);

        // 프로파일 초기화
        public func create_profile(principal: Text) : async Bool {

            let new_profile: Profile = {
                principal = principal;
                var plus = 0;
                var minus = 0;
                var vely_points = 0;
                var comments = Buffer.Buffer<Comment>(0);
            };
            principalToProfile.put(Principal.fromText(principal), new_profile);
            return true;
        };
        
        // 인덱스 초기화
        public func create_index(principal : Text) : async Bool {

            var new_index: Index = {
                var next_id = "";
                var post_address = "";
                var post_groupId = "";
                var friend_tech = "";
                var stars_address = "";
                var stars_twitter_handle = "";
                var stars_groupId = "";
            };
            principalToIndex.put(Principal.fromText(principal), new_index);
            return true;
        };

        // 평가 함수
        public func rate(comment: Text, commentor: Text, like: Bool, principal: Text) : async Bool {
            let new_comment: Comment = {
                comment = comment;
                commentor = commentor;
            };

            var profile = switch (principalToProfile.get(Principal.fromText(principal))) {
                case null {
                    return false;
                };
                case (?profile) {
                    profile;
                };
            };

            if (like) {
                profile.plus += 1;
                // 블리포인트 도출식
                profile.vely_points := profile.plus - profile.minus;
            } else {
                profile.minus += 1;
                // 플리포인트 도출식
                profile.vely_points := profile.plus - profile.minus;
            };

            profile.comments.add(new_comment);

            return true;
        };

        // 인덱스 수정
        public func update_index(principal: Text, info : Text, switcher : Nat) : async Bool {
            var index = switch (principalToIndex.get(Principal.fromText(principal))) {
                case null {
                    return false;
                };
                case (?index) {
                    index;
                };
            };

            switch (switcher) {
                case 0 {
                    index.next_id := info;
                };
                case 1 {
                    index.post_address := info;
                };
                case 2 {
                    index.post_groupId := info;
                };
                case 3 {
                    index.friend_tech := info;
                };
                case 4 {
                    index.stars_address := info;
                };
                case 5 {
                    index.stars_twitter_handle := info;
                };
                case 6 {
                    index.stars_groupId := info;
                };
                case _ {
                    return false;
                };
            };

            return true;
        };

        // 프로파일 쿼리
        public func query_profile(principal: Text) : async [Text] {
            let profile = switch (principalToProfile.get(Principal.fromText(principal))) {
                case null {
                    return [];
                };
                case (?profile) {
                    profile;
                };
            };

            return [profile.principal, Int.toText(profile.plus), Int.toText(profile.minus), Int.toText(profile.vely_points)];
        };

        // 댓글 쿼리
        public func query_comments(principal : Text) : async [Comment]{
            let profile = switch (principalToProfile.get(Principal.fromText(principal))) {
                case null {
                    return [];
                };
                case (?profile) {
                    profile;
                };
            };
            let commentsArray : [Comment] = Buffer.toArray(profile.comments);
            return commentsArray;
        };

        // 인덱스 쿼리
        public func query_index(principal: Text) : async [Text] {
            let index = switch (principalToIndex.get(Principal.fromText(principal))) {
                case null {
                    return [];
                };
                case (?index) {
                    index;
                };
            };

            return [index.next_id, index.post_address, index.post_groupId, index.friend_tech, index.stars_address, index.stars_twitter_handle, index.stars_groupId];
        };

        // Authentication 헬퍼
        public func query_principleToProfile (principal: Text) : async Text  {
            let profile = principalToProfile.get(Principal.fromText(principal));

            return switch (profile) {
                case null {
                    "";
                };
                case (?profile) {
                    profile.principal;
                };
            };
        };
};