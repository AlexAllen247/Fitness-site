import React, { useState, useEffect } from "react";
import { Table, Button, Container, Card } from "react-bootstrap";
import workoutService from "../services/workout";
import ExerciseRow from "./ExerciseRow";
import ExerciseModal from "./ExerciseModal";

const calculateProgressionPlan = (currentReps, currentWeight) => {
  currentReps = Number(currentReps);
  currentWeight = Number(currentWeight);

  if (!currentReps || !currentWeight) {
    return {};
  }

  let increment = 2.5;

  if (currentWeight <= 10) {
    increment = 1;
  } else if (currentWeight <= 20) {
    increment = 2;
  } else {
    increment = 2.5;
  }

  let progressionOptions = {};

  if (currentReps >= 6) {
    const newWeight = currentWeight + increment;
    progressionOptions[`Increase weight to`] = `${newWeight} kg`;
  } else {
    const newReps = currentReps + 1;
    progressionOptions[`Increase reps to`] = `${newReps}`;
  }

  return progressionOptions;
};

const Workout = ({ userId }) => {
  const [workouts, setWorkouts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
  const [selectedExerciseTitle, setSelectedExerciseTitle] = useState("");

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const fetchedWorkouts = await workoutService.get(userId);
        setWorkouts(
          Array.isArray(fetchedWorkouts) ? fetchedWorkouts : [fetchedWorkouts],
        );
      } catch (error) {
        console.error("Error fetching workouts", error);
        setWorkouts([]);
      }
    };

    if (userId) {
      fetchWorkouts();
    }
  }, [userId]);

  const handleExerciseClick = (embedUrl, title) => {
    setSelectedVideoUrl(embedUrl);
    setSelectedExerciseTitle(title);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveExerciseUpdate = async (
    workoutIndex,
    exerciseIndex,
    performance,
  ) => {
    const workout = workouts[workoutIndex];
    const exercise = workout.exercises[exerciseIndex];
    performance.date = new Date();

    try {
      await workoutService.updateExercise(
        workout._id,
        exercise.exerciseId.id,
        performance,
      );

      const updatedWorkouts = [...workouts];
      updatedWorkouts[workoutIndex].exercises[exerciseIndex].performance.push(
        performance,
      );
      setWorkouts(updatedWorkouts);
      console.log("Exercise updated successfully!");
    } catch (error) {
      console.error("Failed to update exercise", error);
    }
  };

  const calculateGuidance = (reps, weight) => {
    if (!reps || !weight) {
      return "";
    }
    const progressionPlan = calculateProgressionPlan(reps, weight);
    const keys = Object.keys(progressionPlan);
    if (keys.length > 0) {
      return `${keys[0]}: ${progressionPlan[keys[0]]}`;
    }
    return "No progression needed";
  };

  const styles = {
    card: {
      textAlign: "center",
      color: "#df0000",
      borderWidth: "2px",
    },
    header: {
      color: "#df0000",
      fontWeight: "bold",
      textDecoration: "underline",
      marginBottom: 40,
      textAlign: "center",
    },
    button: {
      padding: 15,
      marginTop: 35,
      marginBottom: 35,
    },
    columnText: {
      color: "#df0000",
    },
  };

  return (
    <Container>
      <h1 style={styles.header}>Your Workouts</h1>
      {workouts.map((workout, workoutIndex) => (
        <Card
          key={workoutIndex}
          className="my-3"
          style={styles.card}
          border="danger"
        >
          <Card.Body>
            <h3 style={styles.header}>Workout {workoutIndex + 1}</h3>
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th className="col-3" style={styles.columnText}>
                      Name of Exercise
                    </th>
                    <th className="col-2" style={styles.columnText}>
                      Weight
                    </th>
                    <th className="col-2" style={styles.columnText}>
                      Reps
                    </th>
                    <th className="col-2" style={styles.columnText}>
                      Save
                    </th>
                    <th className="col-3" style={styles.columnText}>
                      Guidance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {workout.exercises.map((exercise, exerciseIndex) => (
                    <ExerciseRow
                      key={exerciseIndex}
                      exercise={exercise}
                      exerciseIndex={exerciseIndex}
                      workoutIndex={workoutIndex}
                      handleSaveExerciseUpdate={handleSaveExerciseUpdate}
                      handleExerciseClick={() =>
                        handleExerciseClick(
                          exercise.exerciseId.embedUrl,
                          exercise.exerciseId.title,
                        )
                      }
                      calculateGuidance={calculateGuidance}
                    />
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      ))}
      <ExerciseModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        selectedVideoUrl={selectedVideoUrl}
        selectedExerciseTitle={selectedExerciseTitle}
      />
    </Container>
  );
};

export default Workout;
