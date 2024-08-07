# Avancement - lundi 27/09
## Simulation sur Rviz
Apres la construction du modele du vehicule a simuler ,  on a essayé de la visualiser dans Rviz pour vérifier le bons fonctionnement les __links__  .
Pour faire ceci, on a creer un __launch file__ dont le contenu est le suivant
- la creation du fonction __generate_launch_description()__
```python
def generate_launch_description():
```
- Definir les chemin  des fichier :
```python
  pkg_share = FindPackageShare(package='adavia').find('adavia')
  default_launch_dir = os.path.join(pkg_share, 'launch')
  default_model_path = os.path.join(pkg_share, 'models/adavia_bot.xacro')
  robot_name_in_urdf = 'basic_mobile_bot'
  default_rviz_config_path = os.path.join(pkg_share, 'rviz/urdf_config.rviz')
```
- Definir la configuration de la simulation :
```python
  gui = LaunchConfiguration('gui')
  model = LaunchConfiguration('model')
  rviz_config_file = LaunchConfiguration('rviz_config_file')
  use_robot_state_pub = LaunchConfiguration('use_robot_state_pub')
  use_rviz = LaunchConfiguration('use_rviz')
  use_sim_time = LaunchConfiguration('use_sim_time')
```
- Definir les parametres du __launch__ :
```python
  declare_model_path_cmd = DeclareLaunchArgument(
    name='model', 
    default_value=default_model_path, 
    description='Absolute path to robot urdf file')
    
  declare_rviz_config_file_cmd = DeclareLaunchArgument(
    name='rviz_config_file',
    default_value=default_rviz_config_path,
    description='Full path to the RVIZ config file to use')
    
  declare_use_joint_state_publisher_cmd = DeclareLaunchArgument(
    name='gui',
    default_value='True',
    description='Flag to enable joint_state_publisher_gui')
  
  declare_use_robot_state_pub_cmd = DeclareLaunchArgument(
    name='use_robot_state_pub',
    default_value='True',
    description='Whether to start the robot state publisher')

  declare_use_rviz_cmd = DeclareLaunchArgument(
    name='use_rviz',
    default_value='True',
    description='Whether to start RVIZ')
    
  declare_use_sim_time_cmd = DeclareLaunchArgument(
    name='use_sim_time',
    default_value='True',
    description='Use simulation (Gazebo) clock if true')
```
- Specifier les __actions__ :
```python
  # Publish the joint state values for the non-fixed joints in the URDF file.
  start_joint_state_publisher_cmd = Node(
    condition=UnlessCondition(gui),
    package='joint_state_publisher',
    executable='joint_state_publisher',
    name='joint_state_publisher')

  # A GUI to manipulate the joint state values
  start_joint_state_publisher_gui_node = Node(
    condition=IfCondition(gui),
    package='joint_state_publisher_gui',
    executable='joint_state_publisher_gui',
    name='joint_state_publisher_gui')

  # Subscribe to the joint states of the robot, and publish the 3D pose of each link.
  start_robot_state_publisher_cmd = Node(
    condition=IfCondition(use_robot_state_pub),
    package='robot_state_publisher',
    executable='robot_state_publisher',
    parameters=[{'use_sim_time': use_sim_time, 
    'robot_description': Command(['xacro ', model])}],
    arguments=[default_model_path])

  # Launch RViz
  start_rviz_cmd = Node(
    condition=IfCondition(use_rviz),
    package='rviz2',
    executable='rviz2',
    name='rviz2',
    output='screen',
    arguments=['-d', rviz_config_file])
  
  # Create the launch description and populate
  ld = LaunchDescription()

  # Declare the launch options
  ld.add_action(declare_model_path_cmd)
  ld.add_action(declare_rviz_config_file_cmd)
  ld.add_action(declare_use_joint_state_publisher_cmd)
  ld.add_action(declare_use_robot_state_pub_cmd)  
  ld.add_action(declare_use_rviz_cmd) 
  ld.add_action(declare_use_sim_time_cmd)

  # Add any actions
  ld.add_action(start_joint_state_publisher_cmd)
  ld.add_action(start_joint_state_publisher_gui_node)
  ld.add_action(start_robot_state_publisher_cmd)
  ld.add_action(start_rviz_cmd)

  return ld
```
pour la visualisation dans Rviz il reste juste d'executer le fichier __launch__ en utilisant la commande suivante :
``` bash
ros2 launch adavia adavia.launch.py
```
Ce qui nous donne le resultat suivant :

![Screenshot from 2024-07-29 16-13-47](https://github.com/user-attachments/assets/3bbadd37-1192-4b70-8405-a5906d41f81e)

## Simulation sur Gazbo :
### Choix du version:
D'abord on doit choisir une version de Gazebo compatible avec notre environnement de developpement :


<h3>Résumé des Combinaisons Compatibles de ROS et Gazebo  ¹ <a class="headerlink" href="#summary-of-compatible-ros-and-gazebo-combinations" title="Link to this heading"></a></h3> 
<p>This table includes all currently supported versions of ROS and Gazebo. All
other ROS and Gazebo releases are end of life and we do not recommend their
continued use.</p>
<div class="pst-scrollable-table-container"><table class="table">
<thead>
<tr class="row-odd"><th class="head"><p></p></th>
<th class="head"><p><strong>GZ Citadel (LTS)</strong></p></th>
<th class="head"><p><strong>GZ Fortress (LTS)</strong></p></th>
<th class="head"><p><strong>GZ Garden</strong></p></th>
<th class="head"><p><strong>GZ Harmonic (LTS)</strong></p></th>
</tr>
</thead>
<tbody>
<tr class="row-even"><td><p><strong>ROS 2 Jazzy (LTS)</strong></p></td>
<td><p>❌</p></td>
<td><p>❌</p></td>
<td><p>⚡</p></td>
<td><p>✅</p></td>
</tr>
<tr class="row-odd"><td><p><strong>ROS 2 Rolling</strong></p></td>
<td><p>❌</p></td>
<td><p>✅</p></td>
<td><p>⚡</p></td>
<td><p>⚡</p></td>
</tr>
<tr class="row-even"><td><p><strong>ROS 2 Iron</strong></p></td>
<td><p>❌</p></td>
<td><p>✅</p></td>
<td><p>⚡</p></td>
<td><p>⚡</p></td>
</tr>
<tr class="row-odd"><td><p><strong>ROS 2 Humble (LTS)</strong></p></td>
<td><p>❌</p></td>
<td><p>✅</p></td>
<td><p>⚡</p></td>
<td><p>⚡</p></td>
</tr>
<tr class="row-even"><td><p><strong>ROS 2 Foxy (LTS)</strong></p></td>
<td><p>✅</p></td>
<td><p>❌</p></td>
<td><p>❌</p></td>
<td><p>❌</p></td>
</tr>
<tr class="row-odd"><td><p><strong>ROS 1 Noetic (LTS)</strong></p></td>
<td><p>✅</p></td>
<td><p>⚡</p></td>
<td><p>❌</p></td>
<td><p>❌</p></td>
</tr>
</tbody>
</table>
</div>
<ul class="simple">
<li><p>✅ - Combinaison recommandée</p></li>
<li><p>❌ - Incompatible / not possible.</p></li>
<li><p>⚡ - Possible , <em>mais avec précautions</em>. Ces combinaisons de ROS et Gazebo peuvent fonctionner ensemble, mais nécessitent des ajustements.</p></li>
</ul>

### Instalation de Gazebo Fortress LTS ²

On doit premierement installer les outils necessaires :
```bash
sudo apt-get update
sudo apt-get install lsb-release gnupg
```
Puis on installe notre version de Gazebo :

```bash
sudo curl https://packages.osrfoundation.org/gazebo.gpg --output /usr/share/keyrings/pkgs-osrf-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/pkgs-osrf-archive-keyring.gpg] http://packages.osrfoundation.org/gazebo/ubuntu-stable $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/gazebo-stable.list > /dev/null
sudo apt-get update
sudo apt-get install ignition-fortress
```

### Installation de ROS Gazebo Bridge

on doit installer le pont entre Ros et Gazebo :
```bash
 sudo apt-get install ros-humble-ros-gz
```

### Modification du fichier URDF
Pour qu'on puisse utiliser notre fichier URDF dans l'environnement gazebo on doit faire quelques modifications ou on ajoute les refernences Gazebo pour chaque __link__ :

```xml
<gazebo reference="chassis_link">
  <material>Gazebo/White</material>
  <mu1>0.2</mu1>
  <mu2>0.2</mu2>
  <selfCollide>true</selfCollide>
  <gravity>true</gravity>
</gazebo>

```

Puis on ajoute le plugin __Ackermann Steering__ pour qu'on puisse commander notre vehicule à quatre roues d'une façon realistique
```xml
<plugin name='ackermann_drive' filename='libgazebo_ros_ackermann_drive.so'>
```
et la partie du commande a partir du nœud teleop twist keyboard :

```xml
<ros>
  <namespace>adavia</namespace>
  <remapping>cmd_vel:=cmd_vel</remapping>
        <remapping>odom:=odom</remapping>
  <remapping>distance:=distance</remapping>
</ros>
```

## Simulation :
Apres avoir creer un fichier launchg pour executer la simulation sur Gazebo, On a eu un probleme ce qui sera notre centre d'intérêt pour la prochaine journée. Le probleme est ue Gazebo ne trouve pas les fichiers STL décrites dans le fichier URDF

On execute le fichier launch à partie du commande suivante :
```bash
ros2 launch adavia gazebo.launch.py
```
et on reçoit l'erreur suivant :
```bash
[ruby $(which ign) gazebo-1] [GUI] [Err] [SceneManager.cc:404] Failed to load geometry for visual: fr_1_visual

```

![Screenshot from 2024-07-29 16-33-46](https://github.com/user-attachments/assets/d9a003ff-ff33-40c1-a28e-d06373c35344)



## Sources
1. [Choix de Gazebo](#[link](https://gazebosim.org/docs/fortress/ros_installation/))
2. [Docs / Gazebo Fortress](#[link](https://gazebosim.org/docs/fortress/install_ubuntu/)) 