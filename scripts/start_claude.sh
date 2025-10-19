#!/bin/bash
#
# Print current working directory with fancy formatting
echo -e "\n\033[1;36m╔══════════════════════════════════════════════════════════════╗\033[0m"
echo -e "\033[1;36m║\033[0m                    \033[1;33m📁 CURRENT DIRECTORY 📁\033[0m                   \033[1;36m║\033[0m"
echo -e "\033[1;36m╚══════════════════════════════════════════════════════════════╝\033[0m"

# Center PWD in 64 spaces
PWD_PATH=$(pwd)
PWD_LENGTH=${#PWD_PATH}
TOTAL_WIDTH=64
PADDING=$(( (TOTAL_WIDTH - PWD_LENGTH) / 2 ))
printf "%*s\033[1;32m%s\033[0m\n" $PADDING "" "$PWD_PATH"

#
# Fancy Claude Code startup message
echo -e "\n\033[1;35m╔══════════════════════════════════════════════════════════════╗\033[0m"
echo -e "\033[1;35m║\033[0m                                                              \033[1;35m║\033[0m"
echo -e "\033[1;35m║\033[0m             \033[1;33m🚀 CLAUDE CODE IS STARTING! 🚀\033[0m                   \033[1;35m║\033[0m"
echo -e "\033[1;35m║\033[0m                                                              \033[1;35m║\033[0m"
echo -e "\033[1;35m║\033[0m              --dangerously-skip-permissions                  \033[1;35m║\033[0m"
echo -e "\033[1;35m║\033[0m              --append-system-prompt serena                   \033[1;35m║\033[0m"
echo -e "\033[1;35m║\033[0m                                                              \033[1;35m║\033[0m"
echo -e "\033[1;35m║\033[0m                 \033[1;36m✨ Ready to code! ✨\033[0m                         \033[1;35m║\033[0m"
echo -e "\033[1;35m║\033[0m                                                              \033[1;35m║\033[0m"
echo -e "\033[1;35m╚══════════════════════════════════════════════════════════════╝\033[0m"

claude --dangerously-skip-permissions --append-system-prompt $(uvx --from git+https://github.com/oraios/serena serena print-system-prompt)
