import * as styles from 'styles/pages/tools.module.scss'

import {
  Card,
  CardContent,
  CardHeader,
  CardHeaderIcon,
  CardHeaderTitle,
  Column,
  Columns,
  Content,
} from '@seagreenio/react-bulma'
import { FormattedMessage, Link } from 'gatsby-plugin-react-intl'

import React from 'react'
import Seo from 'components/seo'
import clsx from 'clsx'
import { toolsData } from 'data/tools'

const Tools = () => (
  <>
    <Seo title="Tools" />
    <Columns multiline>
      {toolsData.map(tool => (
        <Column key={tool.icon} size={6}>
          <Link to={tool.link}>
            <Card className={styles.card}>
              <CardHeader className={styles.cardHeader}>
                <CardHeaderTitle>
                  <FormattedMessage id={tool.type} />
                </CardHeaderTitle>
                <CardHeaderIcon
                  className={clsx(styles.toolIcon, styles[tool.icon])}
                />
              </CardHeader>
              <CardContent>
                <Content>
                  <FormattedMessage id={tool.desc} />
                </Content>
              </CardContent>
            </Card>
          </Link>
        </Column>
      ))}
    </Columns>
  </>
)

export default Tools
