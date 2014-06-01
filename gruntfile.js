var properties = require('./public/js/src/game/properties.js')

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-cache-bust')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-open')
  grunt.loadNpmTasks('grunt-contrib-jade')
  grunt.loadNpmTasks('grunt-contrib-imagemin')
  grunt.loadNpmTasks('grunt-contrib-stylus')

  var productionBuild = !!(grunt.cli.tasks.length && grunt.cli.tasks[0] === 'build')

  grunt.initConfig(
    { pkg: grunt.file.readJSON('package.json')

    , project:
      { src: 'public/js/src'
      , js: '<%= project.src %>/game/{,*/}*.js'
      , dest: 'public/js'
      , port: 3017
      , phaser: '<%= project.lib %>/phaser.arcade.js'
      , banner:
        '/*!\n' +
        ' * <%= pkg.title %>\n' +
        ' * <%= pkg.description %>\n' +
        ' * <%= pkg.url %>\n' +
        ' * @author <%= pkg.author %>\n' +
        ' * @version <%= pkg.version %>\n' +
        ' * Copyright <%= pkg.author %>. <%= pkg.license %> licensed.\n' +
        ' * Made using Phaser Blank <https://github.com/lukewilde/phaser-blank/>' +
        ' */\n'
      }

    , connect:
      { server:
        { options:
          { port: '<%= project.port %>'
          , base: './public'
          }
        }
      }

    , jshint:
      { files:
        [ 'gruntfile.js'
        , '<%= project.js %>'
        ]
      , options:
        { jshintrc: '.jshintrc'
        }
      }

    , watch:
      { options:
        { livereload: !productionBuild
        }
      , js:
        { files: '<%= project.dest %>/**/*.js'
        , tasks: []
        }
      , jade:
        { files: 'templates/*.jade'
        , tasks: ['jade']
        }
      , stylus:
        { files: 'public/css/*.styl'
        , tasks: ['stylus']
        }
      }

    , browserify:
      { app:
        { src: ['<%= project.src %>/game/app.js']
        , dest: '<%= project.dest %>/app.js'
        , options:
          { transform: ['browserify-shim']
          , watch: true
          , bundleOptions:
            { debug: !productionBuild
            }
          }
        }
      }

    , open:
      { server:
        { path: 'http://localhost:<%= project.port %>'
        }
      }

    , cacheBust:
      { options:
        { encoding: 'utf8'
        , algorithm: 'md5'
        , length: 8
        }
      , assets:
        { files:
          [
            { src:
              [ 'public/index.html'
              , '<%= project.dest %>/app.js'
              ]
            }
          ]
        }
      }

    , jade:
      { compile:
        { options:
          { data:
            { properties: properties
            , productionBuild: productionBuild
            }
          }
        , files:
          { 'public/index.html': ['templates/index.jade']
          }
        }
      }

    , stylus:
      { compile:
        { files:
          { 'public/css/game.css': ['public/css/*.styl'] }
        , options:
          { sourcemaps: !productionBuild
          }
        }
      }

    , clean: ['<%= project.dest %>/*.js']

    , imagemin:
      { compress:
        { files:
          [ { expand: true
            , cwd: 'public/images/'
            , dest: 'public/images/'
            , src: ['**/*.{png,jpg,gif}']
            }
          ]
        }
      }

    , uglify:
      { options:
        { banner: '<%= project.banner %>'
        }
      , dist:
        { files:
          { '<%= project.dest %>/app.js': '<%= project.dest %>/app.js'
          , '<%= project.dest %>/lib.js': '<%= project.dest %>/lib.js'
          }
        }
      }
    }
  )

  grunt.registerTask('default',
    [ 'clean'
    , 'browserify'
    , 'jade'
    , 'stylus'
    , 'cacheBust'
    , 'connect'
    , 'open'
    , 'watch'
    ]
  )

  grunt.registerTask('build',
    [ 'jshint'
    , 'clean'
    , 'browserify'
    , 'jade'
    , 'stylus'
    , 'uglify'
    , 'cacheBust'
    , 'connect'
    , 'open'
    , 'watch'
    ]
  )

  grunt.registerTask('optimise', ['imagemin'])
}
