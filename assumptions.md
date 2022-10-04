Assumptions

Password:
According to Iteration 1 interface, a valid password is a string with six or more characters. Our group
has decided to keep the restrictions according to the specifications provided. Therefore, passwords such
as '      ' containing six white spaces and '@@!@$%^' containing six special characters are acceptable forms of a valid password.

First name and last name:
Iteration 1 specifies that a valid first name and last name be a string from 1 to 50 characters inclusive. This allows users to input ' E t*_^h aN' as a valid name as an example. However, according
to the specifications, a HandleStr is generated from the concatenation of both first and last name, the removal of white space and special characters and allowing only lowercase alphanumeric numbers. This can cause a slight issue for HandlrStr if e.g both names consist of ONLY special characters ' _^ *-..', HandleStr will just return an empty string. To tackle the problem, our team has decided to restrict both names to have atleast ONE alphanumeric character in their name so HandleStr can return more than an empty string.

