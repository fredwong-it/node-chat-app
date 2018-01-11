const expect = require('expect');

const { Users } = require('./users');



describe('Users', () => {
    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Mike',
            room: 'Node'
        }, {
            id: '2',
            name: 'Jane',
            room: 'Node'
        }, {
            id: '3',
            name: 'Julie',
            room: 'React'
        }];
    });

    it('should add new user', () => {
        var users = new Users();
        var user = {
            id: '123',
            name: 'fred',
            room: 'test'
        };
        var result = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('should return names for Node', () => {
        var userList = users.getUserList('Node');

        expect(userList).toEqual(['Mike', 'Jane']);
    });

    it('should return names for React', () => {
        var userList = users.getUserList('React');

        expect(userList).toEqual(['Julie']);
    });

    it('should remove a user', () => {
        const userId = '1';
        const user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it('should not remove user', () => {
        const userId = '5';
        const user = users.removeUser(userId);

        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
    });

    it('should find user', () => {
        var user = users.getUser('1');

        expect(user).toEqual(users.users[0]);        
    });

    it('should not find user', () => {
        var user = users.getUser('5');

        expect(user).toNotExist();
    });
});