/**
 * The logos are download from these following sites:
 * 
 * https://svgl.app
 * https://svgporn.com
 * https://simpleicons.org
 */

export const logoSrc = {
  'tidb': require('styles/images/developer/tidb-loading.svg')?.default as string,
  'nextjs': require('styles/images/developer/nextjs.svg')?.default as string,
  'prisma': require('styles/images/developer/prisma.svg')?.default as string,
  'typeorm': require('styles/images/developer/typeorm.svg')?.default as string,
  'sequelize': require('styles/images/developer/sequelize.svg')?.default as string,
  'mysql': require('styles/images/developer/mysql.svg')?.default as string,
  'mysql-1': require('styles/images/developer/mysql-1.svg')?.default as string,
  'aws-lambda': require('styles/images/developer/lambda.svg')?.default as string,
  'django': require('styles/images/developer/django.svg')?.default as string,
  'python': require('styles/images/developer/python.svg')?.default as string,
  'sqlalchemy': require('styles/images/developer/sqlalchemy.svg')?.default as string,
  'peewee': require('styles/images/developer/peewee.png')?.default as string,
  'java': require('styles/images/developer/java.svg')?.default as string,
  'mybatis': require('styles/images/developer/mybatis.png')?.default as string,
  'hibernate': require('styles/images/developer/hibernate.svg')?.default as string,
  'spring': require('styles/images/developer/spring.svg')?.default as string,
  'go': require('styles/images/developer/go.svg')?.default,
  'gorm': require('styles/images/developer/gorm.svg')?.default,
  'rails': require('styles/images/developer/rails.svg')?.default,
  'ruby': require('styles/images/developer/ruby.svg')?.default,
  'vscode': require('styles/images/developer/vscode.svg')?.default,
  'dbeaver': require('styles/images/developer/dbeaver.png')?.default,
  'datagrip': require('styles/images/developer/datagrip.svg')?.default
} as const

export type Logo = keyof typeof logoSrc
