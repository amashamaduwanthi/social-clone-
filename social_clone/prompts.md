1. *Initialize the Project in Firebase Studio*:
    - Open Firebase Studio and create a new project.
    - Prompt Gemini: "Set up a new Firebase project structure using Firebase SDK v9 (modular). Include initialization for Authentication, Realtime Database, and Hosting. Generate the necessary config files (e.g., firebase.ts) and provide setup instructions."
    - output-Initial project scaffold with Vite, firebaseConfig.ts, environment variable setup, and the specified directory structure.
    - Commit to GitHub:  "init: Set up Firebase project structure via prompt."
   

2. *Implement User Authentication*:
    - Chain prompts: Reference the setup from Step 1.
    - Prompt Gemini: "Generate React components for user sign-up and login using Firebase Authentication. Include email/password auth, error handling, and session management. Use modular Firebase SDK v9. Provide full code for AuthContext.tsx, Signup.tsx, Login.tsx with basic UI (forms, buttons). Ensure it's functional and commented."
    - Integrate into your project, test login/signup in the browser.
    - Commit: "feat: Generate Firebase auth components via prompt."

3. *Integrate ImgBB API for Image Upload*:
    - Prompt Gemini: "Create a React component for image upload using ImgBB API. Include file input, API key integration (use placeholder for key), upload to ImgBB, and return the image URL. Handle errors and loading states. Provide code for ImageUpload.jsx with comments."
    - Test upload separately.

4. *Build Post Creation Feature*:
    - Chain from auth and upload: "Using the auth session from previous prompts, generate a React component for creating posts. Allow authenticated users to upload an image via ImgBB, add a short caption, and save the post (image URL + caption + user ID + timestamp) to Firebase Realtime Database. Provide code for PostCreate.jsx, including form UI and DB write logic. Ensure real-time sync."
    - output- A functional CreatePost.tsx component with a form for image and caption submission, handling the ImgBB API call and saving post data to Firebase.
    - Commit: "feat: Generate image post creation with ImgBB and DB integration via prompt."

5*Build the Main Feed*:
   - Prompt Gemini: "Generate a React component for the main feed. Fetch all posts from Firebase Realtime Database in chronological order (use timestamps), listen for real-time updates, and display them (image from ImgBB URL + caption + user). Make it visible to all users. Provide code for Feed.jsx with loading state and error handling."
   - Integrate: Ensure feed updates live when new posts are added.
   - Commit: "feat: Generate main feed with real-time DB updates via prompt."
   - Update prompts.md.

6. *Add Basic Styling and Routing*:
    - Prompt Gemini: "Generate basic CSS styling for the app (e.g., responsive layout for auth, post form, feed). Use plain CSS or inline styles. Also, set up simple routing with React Router for pages: home (feed), login, signup, post creation. Provide code for App.js and styles.css."
    - Apply and test navigation.
    - Commit: "style: Generate app styling and routing via prompt."

7. *Prompt Gemini:Based on the existing Firebase project structure (using Firebase SDK v9 modular), authentication, and post creation system previously generated, create a React component to add a comment feature for posts in the "PetPicShare" social media platform. The component should: - Display a text input and submit button
below each post in the Feed.jsx component. 
-Allow only authenticated users to add comments, saving each comment (with user ID, comment text, and timestamp) to a /posts/{postId}/comments node in the Firebase Realtime Database. 
- Retrieve and display all comments for a post in real-time, showing the username (fetched from /users/{userId}) and comment text. 
- Include error handling for cases like empty comments or database write failures. 
- Provide the code as a file (e.g., CommentSection.tsx) with comments explaining each section, using plain CSS for styling. 
- Ensure it integrates seamlessly with the existing Feed.tsx component to render the comment section post.
- Commit: "feat: Display a text input and submit button below each post in the Feed.tsx component.."

8. *Prompt Gemini:Based on the existing Firebase project structure (using Firebase SDK v9 modular) and the authentication system previously generated, create a React component to add a like feature for posts in the social media platform. The component should:
- Display a like button next to each post in the feed, showing the current like count.
- Allow only authenticated users to like a post, updating the like count in the Firebase Realtime Database under a /posts/{postId}/likes node.
- Prevent duplicate likes from the same user by checking their user ID.
- Update the UI in real-time when a like is added or removed.
- Include error handling for cases like authentication failure or database errors.
- Provide the code as a file (e.g., LikeButton.jsx) with comments explaining each section, using plain CSS for styling.
- Ensure it integrates with the existing Feed.jsx component to render the button for each post.
- Commit: "feat: Display a like button next to each post in the feed, showing the current like count."



