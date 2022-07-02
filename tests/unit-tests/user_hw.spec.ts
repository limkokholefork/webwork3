/**
 * @jest-environment jsdom
 */
// The above is needed because the logger uses the window object, which is only present
// when using the jsdom environment.

import { HomeworkSet } from 'src/common/models/problem_sets';
import { CourseUser } from 'src/common/models/users';
import { DBUserHomeworkSet, UserSet, mergeUserSet, ParseableDBUserHomeworkSet,
	ParseableUserHomeworkSet, UserHomeworkSet, DBUserSet } from 'src/common/models/user_sets';

describe('Test user Homework sets', () => {

	describe('Create a User Homework Set', () => {
		const default_user_homework_set: ParseableDBUserHomeworkSet = {
			user_set_id: 0,
			set_id: 0,
			course_user_id: 0,
			set_version: 1,
			set_visible: false,
			set_type: 'HW',
			set_params: { enable_reduced_scoring: false },
			set_dates: {}
		};

		test('Create a DBUserHomeworkSet', () => {
			const user_hw = new DBUserHomeworkSet();
			expect(user_hw).toBeInstanceOf(DBUserHomeworkSet);
			expect(user_hw).toBeInstanceOf(DBUserSet);
			expect(user_hw.toObject()).toStrictEqual(default_user_homework_set);
		});

		test('Check that calling all_fields() and params() is correct', () => {
			const hw_fields = ['user_set_id', 'set_id', 'course_user_id', 'set_version',
				'set_visible', 'set_params', 'set_dates', 'set_type'];
			const hw = new DBUserHomeworkSet();

			expect(hw.all_field_names.sort()).toStrictEqual(hw_fields.sort());
			expect(hw.param_fields.sort()).toStrictEqual(['set_dates', 'set_params']);
			expect(DBUserHomeworkSet.ALL_FIELDS.sort()).toStrictEqual(hw_fields.sort());
		});

		test('Check that cloning a DBUserHomeworkSet works', () => {
			const user_hw = new DBUserHomeworkSet();
			expect(user_hw.clone().toObject()).toStrictEqual(default_user_homework_set);
			expect(user_hw.clone()).toBeInstanceOf(DBUserHomeworkSet);
		});
	});

	describe('Update a User Homework Set', () => {
		test('Set params of a DBUserHomeworkSet', () => {
			const user_hw = new DBUserHomeworkSet();
			user_hw.set_params.enable_reduced_scoring = true;
			expect(user_hw.set_params.enable_reduced_scoring).toBeTruthy();

			user_hw.set_params.enable_reduced_scoring = '0';
			expect(user_hw.set_params.enable_reduced_scoring).toBeFalsy();

			user_hw.set_params.enable_reduced_scoring = 'true';
			expect(user_hw.set_params.enable_reduced_scoring).toBeTruthy();
		});

		test('Set dates of a DBUserHomeworkSet', () => {
			const user_hw = new DBUserHomeworkSet();
			user_hw.set_dates.open = 100;
			expect(user_hw.set_dates.open).toBe(100);

			user_hw.set_dates.set({
				open: 600,
				due: 700,
				answer: 800
			});

			expect(user_hw.set_dates.toObject()).toStrictEqual({
				open: 600,
				due: 700,
				answer: 800
			});

			expect(user_hw.hasValidDates()).toBeTruthy();

			user_hw.set_params.enable_reduced_scoring = true;
			expect(user_hw.hasValidDates()).toBeFalsy();

			user_hw.set_dates.reduced_scoring = 650;
			expect(user_hw.hasValidDates()).toBeTruthy();

		});
	});

	describe('Create User Homework Sets', () => {

		const default_user_homework_set: ParseableUserHomeworkSet = {
			user_id: 0,
			user_set_id: 0,
			set_id: 0,
			course_user_id: 0,
			set_version: 1,
			set_name: '',
			username: '',
			set_type: 'HW',
			set_params: { enable_reduced_scoring: false },
			set_dates: { open: 0, reduced_scoring: 0, due: 0, answer: 0 }
		};

		test('Create a UserHomeworkSet', () => {
			const user_hw = new UserHomeworkSet();
			expect(user_hw).toBeInstanceOf(UserHomeworkSet);
			expect(user_hw).toBeInstanceOf(UserSet);
			expect(user_hw.toObject()).toStrictEqual(default_user_homework_set);
		});

		test('Check that calling all_fields() and params() is correct', () => {
			const user_hw_fields = ['user_set_id', 'set_id', 'course_user_id', 'set_version', 'set_type',
				'user_id', 'set_visible', 'set_name', 'username', 'set_params', 'set_dates'];
			const hw = new UserHomeworkSet();

			expect(hw.all_field_names.sort()).toStrictEqual(user_hw_fields.sort());
			expect(hw.param_fields.sort()).toStrictEqual(['set_dates', 'set_params']);
			expect(UserHomeworkSet.ALL_FIELDS.sort()).toStrictEqual(user_hw_fields.sort());
		});

		test('Check that cloning a UserHomeworkSet works', () => {
			const hw = new UserHomeworkSet();
			expect(hw.clone().toObject()).toStrictEqual(default_user_homework_set);
			expect(hw.clone() instanceof UserHomeworkSet).toBeTruthy();
		});

	});

	describe('Update user homework sets', () => {
		test('Set fields of Homework Set directly', () => {
			const user_set = new UserHomeworkSet();
			user_set.user_set_id = 100;
			expect(user_set.user_set_id).toBe(100);

			user_set.user_set_id = '20';
			expect(user_set.user_set_id).toBe(20);

			user_set.set_id = 7;
			expect(user_set.set_id).toBe(7);

			user_set.set_id = '9';
			expect(user_set.set_id).toBe(9);

			user_set.course_user_id = 25;
			expect(user_set.course_user_id).toBe(25);

			user_set.course_user_id = '18';
			expect(user_set.course_user_id).toBe(18);

			user_set.set_version = 10;
			expect(user_set.set_version).toBe(10);

			user_set.set_version = '22';
			expect(user_set.set_version).toBe(22);

			user_set.set_visible = true;
			expect(user_set.set_visible).toBeTruthy();

			user_set.set_visible = '0';
			expect(user_set.set_visible).toBeFalsy();

			user_set.set_visible = 'true';
			expect(user_set.set_visible).toBeTruthy();

			user_set.set_name = 'HW #1';
			expect(user_set.set_name).toBe('HW #1');

			user_set.username = 'user';
			expect(user_set.username).toBe('user');

		});

		test('Set params of a UserHomeworkSet', () => {
			const user_hw = new UserHomeworkSet();
			user_hw.set_params.enable_reduced_scoring = true;
			expect(user_hw.set_params.enable_reduced_scoring).toBeTruthy();

			user_hw.set_params.enable_reduced_scoring = '0';
			expect(user_hw.set_params.enable_reduced_scoring).toBeFalsy();

			user_hw.set_params.enable_reduced_scoring = 'true';
			expect(user_hw.set_params.enable_reduced_scoring).toBeTruthy();

		});

		test('Set dates of a UserHomeworkSet', () => {
			const user_hw = new UserHomeworkSet();
			user_hw.set_dates.open = 100;
			expect(user_hw.set_dates.open).toBe(100);

			user_hw.set_dates.due = 800;
			expect(user_hw.set_dates.due).toBe(800);

			user_hw.set_dates.answer = 1000;
			expect(user_hw.set_dates.answer).toBe(1000);

			user_hw.set_dates.set({
				open: 600,
				due: 700,
				answer: 800
			});

			expect(user_hw.set_dates.toObject()).toStrictEqual({
				open: 600,
				reduced_scoring: 0,
				due: 700,
				answer: 800
			});

			expect(user_hw.hasValidDates()).toBeTruthy();

			user_hw.set_params.enable_reduced_scoring = true;
			expect(user_hw.hasValidDates()).toBeFalsy();

			user_hw.set_dates.reduced_scoring = 650;
			expect(user_hw.set_dates.reduced_scoring).toBe(650);
			expect(user_hw.hasValidDates()).toBeTruthy();
		});
	});

	describe('Merging a problem set, user set and user', () => {
		const user = new CourseUser({
			user_id: 99,
			course_user_id: 299,
			username: 'homer',
			first_name: 'Homer',
			last_name: 'Simpson',
			email: 'homer@msn.com'
		});
		const hw = new HomeworkSet({
			set_name: 'HW #1',
			set_id: 99,
			set_dates: {
				open: 100,
				due: 200,
				answer: 300
			}
		});
		const db_user_set = new DBUserHomeworkSet({
			set_id: 99,
			course_user_id: 299
		});

		test('created a user homework set by merging db homework and user sets.', () => {
			const expected_user_hw = new UserHomeworkSet({
				user_id: 99,
				course_user_id: 299,
				username: 'homer',
				set_name: 'HW #1',
				set_id: 99,
				set_visible: false,
				set_dates: {
					open: 100,
					due: 200,
					answer: 300
				}
			});
			const merged_set = mergeUserSet(hw, db_user_set, user);
			expect(expected_user_hw).toStrictEqual(merged_set);
		});

		test('create a user homework set with complete set of user set dates', () => {
			db_user_set.set_dates.set({
				open: 150,
				due: 200,
				answer: 500
			});
			const expected_user_hw = new UserHomeworkSet({
				user_id: 99,
				course_user_id: 299,
				username: 'homer',
				set_name: 'HW #1',
				set_id: 99,
				set_visible: false,
				set_dates: {
					open: 150,
					due: 200,
					answer: 500
				}
			});
			const user_set = mergeUserSet(hw, db_user_set, user) as UserHomeworkSet;
			expect(expected_user_hw).toStrictEqual(user_set);

			// check that if the enable_reduced_scoring is flipped on, then the dates are
			// no longer valid
			user_set.set_params.enable_reduced_scoring = true;
			expect(user_set.hasValidDates()).toBeFalsy();

			// but then if the reduced_scoring date is set to the due date it will be
			user_set.set_dates.reduced_scoring = user_set.set_dates.due;
			expect(user_set.hasValidDates()).toBeTruthy();

		});

		test('created a user homework set with reduced scoring dates', () => {
			hw.set_params.enable_reduced_scoring = true;
			hw.set_dates.reduced_scoring = 175;
			const expected_user_hw = new UserHomeworkSet({
				user_id: 99,
				course_user_id: 299,
				username: 'homer',
				set_name: 'HW #1',
				set_id: 99,
				set_visible: false,
				set_dates: {
					open: 150,
					reduced_scoring: 175,
					due: 200,
					answer: 500
				}
			});
			const hw_set = mergeUserSet(hw, db_user_set, user);
			expect(expected_user_hw).toStrictEqual(hw_set);
		});
	});
});