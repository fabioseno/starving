/*global module*/
var users = [
    {
        id: 1,
        name: 'John Papa',
        position: 'Front End Developer',
        avatar: 'https://avatars0.githubusercontent.com/u/1202528?v=3&s=100'
    },
    {
        id: 2,
        name: 'Rick Waldron',
        position: 'Back End Developer',
        avatar: 'https://avatars3.githubusercontent.com/u/27985?v=3&s=100'
    },
    {
        id: 3,
        name: 'Ben Nadel',
        position: 'Tester',
        avatar: 'https://avatars2.githubusercontent.com/u/563690?v=3&s=100'
    },
    {
        id: 4,
        name: 'Douglas Crockford',
        position: 'Product Owner',
        avatar: 'https://avatars3.githubusercontent.com/u/262641?v=3&s=100'
    },
    {
        id: 5,
        name: 'John Resig',
        position: 'Scrum Master',
        avatar: 'https://avatars2.githubusercontent.com/u/1615?v=3&s=100'
    },
    {
        id: 6,
        name: 'Paul Irish',
        position: 'UX Designer',
        avatar: 'https://avatars3.githubusercontent.com/u/39191?v=3&s=100'
    }
],

    list = function (req, res) {
        'use strict';

        res.send({ success: true, data: users});
    },

    getTotalUsers = function () {
        return (users.length);
    };

module.exports = {
    users: users,
    list: list,
    getTotalUsers: getTotalUsers
};