# BookWyrm

[View the Live Project](https://radheyam.github.io/BookWyrm/)

## Overview

BookWyrm is a book finder site enabling a user to send queries to the Google Books API and recieve responses in the form of cards.  On receiving the search results the user can expand a modal, or popup window, by clicking a card to get more information on a given book, they can also save it to a booklist, pin it to their home page or visit the Google Books page for that book via buttons in the modal. 

Why not just use Google Books? Although Google Books itself is an excellent platform, BookWyrm does particularly well in displaying the search results in cards that can be seen at a glance, and instead of clicking each link and opening a new page to get more info on the book, you can access the info on the same page with a click.  It's specifically designed for quick searches, which you can save or pin to your homescreen.  BookWyrm is targeted towards users looking for this feature set, and of course users who simply find the interface subjectively more congenial than Google Books.

## Table of Contents
+ [Planning](#planning)
+ [Development](#development)
+ [Features](#features)
  - [Home Page](#homepage)

+ [Technologies Used](#technologies-used)
+ [Testing](#testing)
+ [Deployment](#deployment)
+ [Credits](#credits)

## Planning

## Development

## Features
[Comprehensive selection of feature images](documents/feature-images/)
### Homepage
#### Search Bar 
A search can be initiated by clicking the search button or by pressing enter when the search bar is active.  Any term can be searched, title, author etc.
#### Update Button 
The update button refreshes the booklist and pinned cards if any changes were made.  In the search results window the button text changes to "New Search", which takes the user back to the homepage and also refreshes the lists if any changes were made.

<img src="documents/feature-images/desktop-homepage.webp" width="70%" height="70%">

### Header
There are four options in the header, three dropdown menus and a theme toggle.  The dropdown list items character length is limited to avoid massive menus.

<img src="documents/feature-images/header.webp" width="50%" height="50%">

#### Booklist
On hovering with the mouse a dropdown of the users saved books appears.  On clicking with the mouse a popup window opens for that specific title.

<img src="documents/feature-images/booklist-dropdown.webp" width="25%" height="25%">

#### History
Shows the last ten searches.  On clicking an item the user can re-initiate a search for that term.

<img src="documents/feature-images/history-dropdown.webp" width="50%" height="50%">

#### Settings 
Three options are available to the user.  The ability to clear the history, booklist and pinned cards memory.  The user is prompted to confirm twice to make sure they want to clear that information.

<img src="documents/feature-images/settings-dropdown.webp" width="50%" height="50%">

#### Theme Toggle 
On clicking, the theme can be toggled between dark and light mode and the user selection will be remembered after refresh.
### Search Results
On initiating a search the search bar and header are hidden.  This is to avoid any issues with multiple search results in the same window and so that any changes to lists made by the 
user can be updated smoothly before the lists can be accessed.

<img src="documents/feature-images/search-result-desktop.webp" width="50%" height="50%">

### Cards
The results of a search are returned in card form with an image of the book, the title and the author(s). A placeholder image is supplied if the API object does not contain an image link.  If the user wants more info on the book they can click anywhere on the card to open a popup window.

### Pinned Cards
Books pinned by the user are displayed below the search bar in card form with a green pin in the corner.  On clicking the card a popup window with details appears.

<img src="documents/feature-images/pinned-cards-tablet.webp" width="50%" height="50%">

### Popup Window (Modal)
The popup is accessed by clicking a card or an item in the booklist.  On opening the user receives more information concerning the book and gains access to actions through the two buttons and external link described below.

<img src="documents/feature-images/popup-no-lists.webp" width="75%" height="75%">

### Popup Buttons
The popup contains two interactive buttons, which have varying functions depending on whether the book belongs to a user list or not, and the color and text also change accordingly providing satisfying feedback and useful information to the user.

<img src="documents/feature-images/popup-added-remove.webp" width="75%" height="75%">

### Footer
A footer was not included as it was deemed unnecessary.

## Technologies Used

## Testing

## Deployment

## Credits