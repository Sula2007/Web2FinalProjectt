export const sendTaskAssignmentEmail = async (task) => {
  console.log(
    `📧 Email sent: task "${task.title}" assigned to ${task.assignedTo}`
  );
};
