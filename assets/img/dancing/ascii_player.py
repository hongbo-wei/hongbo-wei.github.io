# -*- coding:utf8 -*-
"""
ASCII Animation Player Module
Plays ASCII art files as animation in terminal
"""

import os
import time


def play_ascii_animation(ascii_dir, frame_delay=0.05, loop=False):
    """
    Play ASCII art animation in terminal
    
    Args:
        ascii_dir (str): Directory containing ASCII art text files
        frame_delay (float): Delay between frames in seconds (default: 0.05)
        loop (bool): Whether to loop the animation (default: False)
    
    Returns:
        None
    """
    if not os.path.exists(ascii_dir):
        print(f"Error: ASCII directory not found {ascii_dir}")
        return
    
    # Get all text files
    ascii_files = [f for f in os.listdir(ascii_dir) if f.endswith('.txt')]
    ascii_files.sort()  # Ensure correct order
    
    if not ascii_files:
        print(f"No ASCII art files found in {ascii_dir}")
        return
    
    print(f"Playing ASCII animation with {len(ascii_files)} frames...")
    print("Press Ctrl+C to stop")
    
    try:
        while True:
            # Clear screen once at the beginning
            os.system('clear')
            
            for ascii_file in ascii_files:
                file_path = os.path.join(ascii_dir, ascii_file)
                
                with open(file_path, 'r') as f:
                    content = f.read()
                
                # Move cursor to top-left corner and print
                print('\033[H', end='')  # Move cursor to home position
                print(content, end='')   # Print without adding extra newline
                
                time.sleep(frame_delay)
            
            if not loop:
                break
                
    except KeyboardInterrupt:
        pass
    finally:
        # Clear screen at the end
        os.system('clear')
        print("Animation completed!")


def list_available_animations(base_dir="."):
    """
    List all available ASCII animation directories
    
    Args:
        base_dir (str): Base directory to search for ASCII animations
    
    Returns:
        list: List of ASCII animation directory paths
    """
    ascii_dirs = []
    
    for item in os.listdir(base_dir):
        item_path = os.path.join(base_dir, item)
        if os.path.isdir(item_path) and item.endswith('_ascii'):
            ascii_dirs.append(item_path)
    
    return sorted(ascii_dirs)


if __name__ == '__main__':
    import sys
    
    if len(sys.argv) == 1:
        # No arguments - list available animations
        animations = list_available_animations()
        if animations:
            print("Available ASCII animations:")
            for i, anim in enumerate(animations, 1):
                print(f"{i}. {os.path.basename(anim)}")
            
            try:
                choice = int(input("\nSelect animation number (or 0 to exit): "))
                if choice > 0 and choice <= len(animations):
                    play_ascii_animation(animations[choice - 1])
            except (ValueError, KeyboardInterrupt):
                print("Exiting...")
        else:
            print("No ASCII animations found in current directory")
            print("Usage: python ascii_player.py <ascii_directory>")
    
    elif len(sys.argv) == 2:
        ascii_dir = sys.argv[1]
        play_ascii_animation(ascii_dir)
    
    else:
        print("Usage: python ascii_player.py [ascii_directory]")
        print("If no directory specified, will list available animations")
