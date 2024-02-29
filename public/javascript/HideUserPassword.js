const hideUserPassword = (user) => {
  const newUser = JSON.parse(JSON.stringify(user));

  let newPassword = "";
  for (let i = 0; i < user.password.length; i++) {
    if (i >= user.password.length - 2 || i == 0 || i == 1)
      newPassword += user.password[i];
    else newPassword += "*";
  }
  console.log(newPassword);
  //return { ...newUser, password: newPassword };
};

module.exports = hideUserPassword;
