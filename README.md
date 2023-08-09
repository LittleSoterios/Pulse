# Pulse

## Overview
Pulse is a social media platform inspired by Twitter and Threads. However, instead of tweets, we have beats. Beats are the heartbeats of our users, encapsulating thoughts, emotions, and snippets of their lives.

## Usage
To use Pulse:

Register for an account at https://pulse-social-6a1e7f6e9542.herokuapp.com/ 
Once registered, users can create, edit, and delete their beats.
Search for and interact with other users by following and liking their beats.
Customize your profile picture and see beats that you've liked.

## Timeframe
The MVP was created over the course of one week.

## Technologies
Frontend: React.js
Backend: Express.js, Node.js
Database: MongoDB
Additional Libraries: Mongoose for data modeling, React-Router for SPA navigation.

## Brief
The aim was to create a fullstack application using the MERN stack. Implementing full CRUD functionality and consuming an external API. 


## Planning
Research: Started by studying Twitter's main features and functionalities.
Wireframing: Outlined main pages: Homepage, Profile, and Create Beat - these can be found here: https://www.figma.com/file/C6vwgG0T0gGdnTqe9pWXa1/Freader?type=design&node-id=0-1&mode=design&t=ju9GkMlRC3MQfDq4-0
Database Schema Design: Designed models for User, Beats, and interactions like likes and comments: https://app.quickdatabasediagrams.com/#/d/AltSwL

## Build Process
I started by establishing a server with Node.js, setting up API routes with Express.js, and integrated MongoDB with Mongoose.


Frontend Development: Used React.js along with react-bootstrap to create a mobile centric UI. Implemented state management for user sessions and beat interactions.
Styling: Focused on a minimalist design, utilizing neutral color schemes and intuitive icons.


##  Challenges
### Image Hosting with Cloudinary:
One of the more intricate parts of building Pulse was implementing the image hosting using Cloudinary. A few key challenges arose during this process:

Ambiguous Documentation: Navigating Cloudinary's documentation was at times challenging. While the platform offers robust features, the documentation was not always intuitive, especially for certain specific requirements I had in mind.

Image Sizing: Ensuring consistency in avatar and profile picture dimensions across various user uploads was another obstacle. Users often upload images of various dimensions and sizes, and making sure they fit well within the platform's UI, without stretching or reducing clarity, required a lot of adjustments and trials.

Integration with MERN: Integrating Cloudinary with the MERN stack and ensuring that image upload, retrieval, and deletion processes were seamless took additional effort and testing.

Overcoming these challenges required a mix of deep diving into forums, experimentation, and sometimes even rethinking the approach. The end result, however, was a robust image handling process that enhances the user experience on Pulse.

### Lazy loading/infintie scroll
A key feature of any modern social networking app is lazy loading on the home screen. Given the dynamic nature of user-generated content and potentially large numbers of beats, it was paramount to load these items efficiently.

The Intersection Observer API became the go-to solution for this challenge. It enabled Pulse to asynchronously observe changes in the intersection of a target element (in this case, the beats) with its parent, thereby triggering the loading of more content only when the user is nearing the end of the current list.

Here's how it was accomplished:

React Refs with Forwarding: By wrapping the Beat component with React.forwardRef, I ensured that the component can access the ref (or reference) of the last beat in the list. This was crucial to attach the observer to the right beat.

Dynamic Observation: Utilizing the useCallback hook, I set up dynamic observation of the last beat in the list. Whenever the user scrolls and the last beat becomes visible (with a margin of 500px in this case), the observer detects this intersection and triggers the fetching of more beats, if available. This was further optimized by disconnecting the observer during ongoing data fetches to avoid unnecessary triggers.

Efficient Fetching: Coupled with a backend pagination mechanism, this lazy loading strategy ensured that Pulse always fetched beats in chunks, making the loading times quicker and offering a seamless scrolling experience to the users. A spin-off benefit was reduced server load and bandwidth usage, making the app more scalable.

The frontend: 

```
const BeatWithRef = React.forwardRef((props, ref) => <Beat ref={ref} {...props} />);

export default function BeatList({user}) {
  

  const [beats, setBeats] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);  // Add a new state to track if a fetch is ongoing
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true);

  const observer = useRef();
  const lastBeatRef = useCallback(node => {
    if (loading) return;  // Don't observe the last beat while loading
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPageNumber => prevPageNumber + 1);
      }
    }, 
    { rootMargin: '500px' });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);  // Add loading to the dependencies

  useEffect(() => {
      fetchBeats();
  }, [page]);

  const fetchBeats = async () => {
      setLoading(true);  // Set loading to true at the start of the fetch
      const response = await sendRequest(`/post/index?page=${page}`);
      const data = await response
      
      setBeats(oldBeats => [...oldBeats, ...data.pack]);
      setLoading(false); 
      setIsLoading(false); // Set loading back to false when the fetch is done
      setHasMore(data.hasMore)
  }

  const handleDelete = async (beatId) =>{
    try {
      await sendRequest(`/post/delete/${beatId}`, 'DELETE')
      const updatedBeats = beats.filter(beat => beat.post._id !== beatId);
      setBeats(updatedBeats);
      

    } catch (err) {
      console.log(err)
    }
  }

  if(isLoading){
    return(
      <Loading></Loading>
    )
  }

  return (
      <div className="beat-list">
          {beats.map((beat, index) => {
              if (beats.length === index + 1) {
                  return  <BeatWithRef ref={lastBeatRef} key={beat.post._id} beat={beat} user={user} handleDelete={handleDelete}/>
              } else {
                  return <Beat key={beat.post._id} beat={beat} user={user} handleDelete={handleDelete}/>
              }
          })}
      </div>
  );
}
```

The backend:
```
async function index(req, res) {

  try {
    const page = parseInt(req.query.page) || 1;  // Get the page number from the query parameters
    const limit = 10;  // Define how many beats to return per page
    const skip = (page - 1) * limit;  // Calculate how many documents to skip
    let hasMore = true
    const history = await History.findOne({ user: req.user._id })
    

    const beats = await Post.find({
      user: { $in: history.following }
    })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })

    
    
    if(beats.length === 0) hasMore = false
    const pack = await Promise.all(beats.map(async (beat) => {
      const user = await Setting.findOne({user: beat.user});
      
      return {post: beat, user: user};
    }));
    res.json({pack, hasMore})
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}
```


## Wins
### Tracking and Displaying User Likes:
Reverse Chronological Order: One of the significant wins for Pulse was the ability to not only track the beats that users liked but also to display them on their profile page in reverse chronological order. This feature added depth to the user experience, allowing users to view their historical preferences at a glance and relive moments or beats that resonated with them. Achieving this involved backend logic and frontend rendering to ensure efficiency and a seamless user experience. The backend is included below: 

```
async function index_own(req, res) {

  try {
    const user = await Setting.findOne({user: req.user._id});
    const beats = await Post.find({ user: req.user._id }).sort({ createdAt: -1 })
    
    const pack = await Promise.all(beats.map(async (beat) => {
      return { post: beat, user: user };
    }));
    res.json(pack)

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}
```

### Implementing Notifications for Liked Beats:
Instant Engagement: Enhancing user interactivity and engagement was always a priority while building Pulse. Therefore, another substantial win was the implementation of instant notifications for beat owners when another user liked their beat.

The backend controller for liking posts is below:

```
async function like(req, res) {

  try {
    const history = await History.findOne({ user: req.user._id })
    const post = await Post.findById(req.params.id)
    const user = await User.findById(req.user._id) // this is the user that liked the post
    
    if(post.user.toString() !== user._id.toString()){  // only add notification if the user is not liking their own post
      const likedUser = await History.findOne({user : post.user}) // this is the user who's post it was that was liked
      const notification = {type: 'like', from: user._id, post: post._id, read: false}
      likedUser.notifications.push(notification) // this handles the notification for the like receiving user
      likedUser.save()
    }
    
    history.liked.push(post._id) // add posted to users history
    history.save()
    post.likes.push(user._id) // add the user to the post's liked
    post.save()

    res.json({ likes: post.likes })

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}
```


## Key Learnings
React's Power:

State Management: Mastered the art of using React states to ensure data consistency and cater to dynamic user interactions.

Hooks: useEffect became a foundational tool for data-fetching and side effects, while useRef was instrumental in direct DOM interactions, particularly for advanced patterns like lazy loading.

Cloudinary Integration:

Navigating Documentation: Overcame challenges in Cloudinary's documentation to successfully implement cloud-based image hosting.

Image Size Handling: Ensured consistent user experience by adeptly managing avatar and profile picture dimensions.
