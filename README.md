# BookWyrm

[View the Live Project](https://radheyam.github.io/BookWyrm/)

## Overview

BookWyrm is a book finder site enabling the user to send queries to the Google Books API and recieve responses in the form of cards.  The user can expand a modal by clicking a card to get more information on a given book, they can also save it to a booklist, pin it to their home page or visit the Google Books page for that book, via buttons in modal. 

The aim of the project is to provide a clean and simple interface to search for and save books.  Although Google Books itself is an excellent resource there seemed to be an opening for site that allows the user to see the results quickly, at a glance in the form of cards.

## Table of Contents
* [Planning](#planning)
* [Features](#features)
* [Technologies Used](#technologies-used)
* [Testing](#testing)
* [Deployment](#deployment)
* [Credits](#credits)

## Planning

## Features

Homepage
  Search Bar, the search can be initiated by clicking the Search button or by pressing enter when the search bar is active.  Any term can be search, title, author etc.
  Update Button, refreshes the booklist and pinned cards if any changes made.  In the search results window the button text changes to "New Search", which takes the user back to the homepage and also refreshes the lists if any changes were made.
  All interactive buttons have a responsive animation on hover to engage the user and give feedback to user action.
Header, there are four options in the header, three dropdown menus and a theme toggle.  The dropdown list items character lengh is limited to avoid massive menus.
  Booklist, on hovering with the mouse a dropdown of the users saved books appears.  On clicking with the mouse a popup window opens for that specific title.
  History, shows the last ten searches.  On clicking an item the user can re-initiate a search for that term.
  Settings, currently with three options to clear history, booklist and pinned cards.  The user is prompted to confirm twice to make sure they want to clear that information.
  Theme Toggle, on click the theme can be toggled from dark to light and the users selection will be remembered and remain after refresh.
Search Results
  On initiating a search the search bar and header are hidden.  This is to avoid any issues with multiple search results in the same window and so that any changes to lists made by the user can be updated smoothly before the lists can be accessed.
Cards, the results of a search are returned in card form with an image of the book, the title and the author(s). A placeholder image is supplied if the API object does not contain an image link.  If the user wants more info on the book they can click anywhere on the card to open a popup window.
Pinned Cards,Books pinned by the user are displayed below the search bar in card form, with a green pin in the corner.  On clicking the card a popup window with details appears.
Popup (Modal) Window, On clicking a card or an item in the booklist a popup window is displayed containing the following
  The title of the book is displayed top left, picture of the cover below, some details concerning the book are displayed in the center and to the right are three interactive buttons providing the user with a variety of options.  The rest of the card contains a description as provided by the API.
  There are two ways to close the popup, an 'X' beside the title or by clicking outside the popup on the overlay background.
  The popup reshapes itself according to the size of the screen, and if there is overflow a scroll bar appears.
  
Popup Buttons, the popup contains three interactive buttons, the first two of which have varying functions depending on whether the book blongs to a user list or not.  Should they belong to a list they change color and text accordingly.  When clicked to add they will turn green and text changes.  If the popup for the same book is opened again the button will be yellow and text giving the user the option of removing the book and also indicating which list it already belongs to.  On clicking remove the text changes again confirming the action.
 "To Booklist" adds a book, "Pin To Home" generates a card on page reload and "Google Books" takes the user to the google books page for the specific book.
  

## Technologies Used

## Testing

## Deployment

## Credits