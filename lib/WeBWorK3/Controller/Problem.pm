package WeBWorK3::Controller::Problem;
use warnings;
use strict;

use Mojo::Base 'Mojolicious::Controller', -signatures;

sub addProblem ($self) {
	my $problem = $self->schema->resultset("Problem")->addSetProblem(
		params => {
			course_id => int($self->param("course_id")),
			set_id    => int($self->param("set_id")) % { $self->req->json }
		}
	);
	$self->render(json => $problem);
	return;
}

sub getAllProblems ($self) {
	my @problems = $self->schema->resultset("Problem")->getProblems(
		info => {
			course_id => int($self->param("course_id"))
		}
	);
	$self->render(json => \@problems);
	return;
}

sub updateProblem ($self) {
	my $updated_problem = $self->schema->resultset("Problem")->updateSetProblem(
		info => {
			course_id  => int($self->param("course_id")),
			set_id     => int($self->param("set_id")),
			problem_id => int($self->param("problem_id"))
		},
		params => $self->req->json
	);
	$self->render(json => $updated_problem);
	return;
}

sub deleteProblem ($self) {
	my $deleted_problem = $self->schema->resultset("Problem")->deleteSetProblem(
		info => {
			course_id  => int($self->param("course_id")),
			set_id     => int($self->param("set_id")),
			problem_id => int($self->param("problem_id"))
		}
	);
	$self->render(json => $deleted_problem);
	return;
}

sub getUserProblems ($self) {
	print $self->param("merged") . "\n";
	my %args = (
		info => {
			course_id => int($self->param('course_id')),
			user_id   => int($self->param('user_id'))
		}
	);
	if ($self->param("merged") eq "true") {
		$args{merged} = 1;
	}
	my @user_problems = $self->schema->resultset("UserProblem")->getCourseUserProblems(%args);

	# delete some unneeded fields before sending back
	my @fields =
		$self->param("merged") eq "true"
		? qw/course_name set_name username/
		: qw/course_name problem_number set_name username/;
	for my $user_problem (@user_problems) {
		for my $key (@fields) {
			delete $user_problem->{$key} if defined $user_problem->{$key};
		}
	}
	$self->render(json => \@user_problems);
	return;
}

1;
